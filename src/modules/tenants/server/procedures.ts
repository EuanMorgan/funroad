import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { Media, Tenant } from "~/payload-types";
import { baseProcedure, createTRPCRouter } from "~/trpc/init";

export const tenantsRouter = createTRPCRouter({
	getone: baseProcedure
		.input(
			z.object({
				slug: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const tenantsData = await ctx.payload.find({
				collection: "tenants",
				depth: 1, // tenant.image should be fetched
				where: {
					slug: {
						equals: input.slug,
					},
				},
				limit: 1,
				pagination: false,
			});

			const tenant = tenantsData.docs[0];

			if (!tenant) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Tenant not found",
				});
			}

			return tenant as Tenant & { image: Media | null };
		}),
});
