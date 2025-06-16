import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { DEFAULT_PAGINATION_LIMIT, MAX_PAGINATION_LIMIT } from "~/constants";
import type { Media, Tenant } from "~/payload-types";
import { createTRPCRouter, protectedProcedure } from "~/trpc/init";

export const libraryRouter = createTRPCRouter({
	getMany: protectedProcedure
		.input(
			z.object({
				cursor: z.number().min(1).default(1),
				limit: z
					.number()
					.max(MAX_PAGINATION_LIMIT)
					.default(DEFAULT_PAGINATION_LIMIT),
			}),
		)
		.query(async ({ ctx, input }) => {
			const ordersData = await ctx.payload.find({
				collection: "orders",
				depth: 0, // Just ids without populating
				where: {
					user: {
						equals: ctx.session.user.id,
					},
				},
				page: input.cursor,
				limit: input.limit,
			});

			const productIds = ordersData.docs.map((order) => order.product);

			const productsData = await ctx.payload.find({
				collection: "products",
				pagination: false,
				where: {
					id: {
						in: productIds,
					},
				},
			});

			return {
				...productsData,
				docs: productsData.docs.map((doc) => ({
					...doc,
					image: doc.image as unknown as Media | null,
					tenant: doc.tenant as unknown as Tenant & { image: Media | null },
				})),
			};
		}),
	getOne: protectedProcedure
		.input(
			z.object({
				productId: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const ordersData = await ctx.payload.find({
				collection: "orders",
				where: {
					and: [
						{
							product: {
								equals: input.productId,
							},
						},
						{
							user: {
								equals: ctx.session.user.id,
							},
						},
					],
				},
				limit: 1,
				pagination: false,
			});

			const order = ordersData.docs[0];

			if (!order) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Product not found in library",
				});
			}

			const product = await ctx.payload.findByID({
				collection: "products",
				id: input.productId,
			});

			if (!product) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Product not found",
				});
			}

			return product;
		}),
});
