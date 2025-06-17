import { TRPCError } from "@trpc/server";
import { cookies as getCookies, headers as getHeaders } from "next/headers";
import { stripe } from "~/lib/stripe";
import { loginSchema, registerSchema } from "~/modules/auth/schemas";
import { login } from "~/modules/auth/server/helpers";
import { baseProcedure, createTRPCRouter } from "~/trpc/init";

export const authRouter = createTRPCRouter({
	session: baseProcedure.query(async ({ ctx }) => {
		const headers = await getHeaders();
		const session = await ctx.payload.auth({ headers });
		return session;
	}),
	logout: baseProcedure.mutation(async ({ ctx }) => {
		const cookies = await getCookies();
		cookies.delete(`${ctx.payload.config.cookiePrefix}-token`);
	}),
	register: baseProcedure
		.input(registerSchema)
		.mutation(async ({ ctx, input }) => {
			const data = await ctx.payload.find({
				collection: "users",
				limit: 1,
				where: {
					username: {
						equals: input.username,
					},
				},
			});

			const existingUser = data.docs[0];

			if (existingUser) {
				throw new TRPCError({
					code: "CONFLICT",
					message: "Username already exists",
				});
			}

			const stripeAccount = await stripe.accounts.create({});

			if (!stripeAccount.id) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to create Stripe account",
				});
			}

			const tenant = await ctx.payload.create({
				collection: "tenants",
				data: {
					name: input.username,
					slug: input.username,
					stripeAccountId: stripeAccount.id,
				},
			});

			await ctx.payload.create({
				collection: "users",
				data: {
					email: input.email,
					username: input.username,
					password: input.password, // password is hashed by payload
					tenants: [
						{
							tenant: tenant.id,
						},
					],
				},
			});

			await login(ctx.payload, input);
		}),
	login: baseProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
		await login(ctx.payload, input);
	}),
});
