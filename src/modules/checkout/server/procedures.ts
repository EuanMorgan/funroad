import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { Media, Tenant } from "~/payload-types";
import { baseProcedure, createTRPCRouter } from "~/trpc/init";

export const checkoutRouter = createTRPCRouter({
	getProducts: baseProcedure
		.input(
			z.object({
				ids: z.array(z.string()),
			}),
		)
		.query(async ({ ctx, input }) => {
			const data = await ctx.payload.find({
				collection: "products",
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
