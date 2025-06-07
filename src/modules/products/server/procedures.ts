import type { Where } from "payload";
import { z } from "zod";
import type { Category } from "~/payload-types";
import { baseProcedure, createTRPCRouter } from "~/trpc/init";

export const productsRouter = createTRPCRouter({
	getMany: baseProcedure
		.input(
			z.object({
				categorySlug: z.string().nullish(),
				minPrice: z.string().nullish(),
				maxPrice: z.string().nullish(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const where: Where = {};

			if (input.minPrice) {
				where.price = {
					...where.price,
					greater_than_equal: input.minPrice,
				};
			}

			if (input.maxPrice) {
				where.price = {
					...where.price,
					less_than_equal: input.maxPrice,
				};
			}

			// If categorySlug is provided, we fetch it
			// Then, if it has subcategories, we grab all their slugs
			// This ensures that when we are in a parent category we fetch
			// all parent and child products
			if (input.categorySlug) {
				const categoriesData = await ctx.payload.find({
					collection: "categories",
					limit: 1,
					depth: 1,
					pagination: false,
					where: {
						slug: {
							equals: input.categorySlug,
						},
					},
				});

				const formattedCategoriesData = categoriesData.docs.map((doc) => ({
					...doc,
					subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
						// Because of "depth: 1" we are confident "doc" will be a type of "Category" and not string | "Category"
						...(doc as Category),
					})),
				}));

				const subcategorySlugs = [];

				const parentCategory = formattedCategoriesData[0];

				if (parentCategory) {
					subcategorySlugs.push(
						...parentCategory.subcategories.map(
							(subcategory) => subcategory.slug,
						),
					);
					where["category.slug"] = {
						in: [parentCategory.slug, ...subcategorySlugs],
					};
				}
			}
			const data = await ctx.payload.find({
				collection: "products",
				depth: 1, // Populate category and image
				where,
			});

			return data;
		}),
});
