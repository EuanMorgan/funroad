import { TRPCError } from "@trpc/server";
import type Stripe from "stripe";
import { z } from "zod";
import { PLATFORM_FEE_PERCENTAGE } from "~/constants";
import { env } from "~/env";
import { stripe } from "~/lib/stripe";
import type {
	CheckoutSessionMetadata,
	ProductMetadata,
} from "~/modules/checkout/types";
import type { Media, Tenant } from "~/payload-types";
import {
	baseProcedure,
	createTRPCRouter,
	protectedProcedure,
} from "~/trpc/init";

export const checkoutRouter = createTRPCRouter({
	verify: protectedProcedure.mutation(async ({ ctx }) => {
		const user = await ctx.payload.findByID({
			collection: "users",
			id: ctx.session.user.id,
			depth: 0, // user.tenants[0] will be tenant ID
		});

		if (!user) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "User not found",
			});
		}

		const tenantId = user.tenants?.[0]?.tenant as string;

		const tenant = await ctx.payload.findByID({
			collection: "tenants",
			id: tenantId,
		});

		if (!tenant) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "Tenant not found",
			});
		}

		const accountLink = await stripe.accountLinks.create({
			account: tenant.stripeAccountId,
			refresh_url: `${env.NEXT_PUBLIC_BASE_URL}/admin`,
			return_url: `${env.NEXT_PUBLIC_BASE_URL}/admin`,
			type: "account_onboarding",
		});

		if (!accountLink.url) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to create account link",
			});
		}

		return {
			url: accountLink.url,
		};
	}),
	purchase: protectedProcedure
		.input(
			z.object({
				productIds: z.array(z.string()).min(1),
				tenantSlug: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const products = await ctx.payload.find({
				collection: "products",
				depth: 2,
				select: {
					content: false,
				},
				where: {
					and: [
						{
							id: {
								in: input.productIds,
							},
						},
						{
							"tenant.slug": {
								equals: input.tenantSlug,
							},
						},
					],
				},
			});

			if (products.totalDocs !== input.productIds.length) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Some products were not found",
				});
			}

			const tenantsData = await ctx.payload.find({
				collection: "tenants",
				limit: 1,
				pagination: false,
				where: {
					slug: {
						equals: input.tenantSlug,
					},
				},
			});

			const tenant = tenantsData.docs[0];

			if (!tenant) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Tenant not found",
				});
			}

			if (!tenant.stripeDetailsSubmitted) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Tenant has not submitted stripe details",
				});
			}

			const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
				products.docs.map((product) => ({
					price_data: {
						unit_amount: product.price * 100, // convert to pence
						currency: "GBP",
						product_data: {
							name: product.name,
							metadata: {
								stripeAccountId: tenant.stripeAccountId,
								id: product.id,
								name: product.name,
								price: product.price,
							} satisfies ProductMetadata,
						},
					},
					quantity: 1,
				}));

			const totalAmount = products.docs.reduce(
				(acc, product) => acc + Number(product.price) * 100, // convert to pence
				0,
			);

			const platformFeeAmount = Math.round(
				totalAmount * (PLATFORM_FEE_PERCENTAGE / 100),
			);

			const checkout = await stripe.checkout.sessions.create(
				{
					customer_email: ctx.session.user.email,
					success_url: `${env.NEXT_PUBLIC_BASE_URL}/tenants/${input.tenantSlug}/checkout?success=true`,
					cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/tenants/${input.tenantSlug}/checkout?cancel=true`,
					line_items: lineItems,
					mode: "payment",
					invoice_creation: {
						enabled: true,
					},
					metadata: {
						userId: ctx.session.user.id,
					} satisfies CheckoutSessionMetadata,
					payment_intent_data: {
						application_fee_amount: platformFeeAmount,
					},
				},
				{
					stripeAccount: tenant.stripeAccountId,
				},
			);

			if (!checkout.url) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to create checkout session",
				});
			}

			return {
				url: checkout.url,
			};
		}),
	getProducts: baseProcedure
		.input(
			z.object({
				ids: z.array(z.string()),
			}),
		)
		.query(async ({ ctx, input }) => {
			const data = await ctx.payload.find({
				collection: "products",
				select: {
					content: false,
				},
				depth: 2, // Populate category and image
				where: {
					id: {
						in: input.ids,
					},
				},
			});

			if (data.totalDocs !== input.ids.length) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Some products were not found",
				});
			}

			const totalPrice =
				data.docs.reduce((acc, product) => acc + Number(product.price), 0) || 0;

			return {
				...data,
				totalPrice,
				docs: data.docs.map((doc) => ({
					...doc,
					image: doc.image as unknown as Media | null,
					tenant: doc.tenant as unknown as Tenant & { image: Media | null },
				})),
			};
		}),
});
