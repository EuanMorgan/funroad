import { headers as getHeaders } from "next/headers";
import type { Sort, Where } from "payload";
import { z } from "zod";
import { DEFAULT_PAGINATION_LIMIT, MAX_PAGINATION_LIMIT } from "~/constants";
import { sortValues } from "~/modules/products/search-params";
import { getSummarisedReviews } from "~/modules/reviews/servers/helpers";
import type { Category, Media, Tenant } from "~/payload-types";
import { baseProcedure, createTRPCRouter } from "~/trpc/init";

export const productsRouter = createTRPCRouter({
	getOne: baseProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const headers = await getHeaders();

			const session = await ctx.payload.auth({ headers });

			const product = await ctx.payload.findByID({
				collection: "products",
				id: input.id,
				depth: 2, // load product image, tenant and tenant image
				select: {
					content: false,
				},
			});

			let isPurchased = false;

			if (session.user) {
				const ordersData = await ctx.payload.find({
					collection: "orders",
					pagination: false,
					limit: 1,
					where: {
						and: [
							{
								product: {
									equals: input.id,
								},
							},
							{
								user: {
									equals: session.user.id,
								},
							},
						],
					},
				});

				isPurchased = ordersData.totalDocs > 0;
			}

			const reviewsData = await ctx.payload.find({
				collection: "reviews",
				pagination: false,
				where: {
					product: {
						equals: input.id,
					},
				},
			});

			const reviewRating =
				reviewsData.docs.length > 0
					? reviewsData.docs.reduce((acc, review) => acc + review.rating, 0) /
						reviewsData.totalDocs
					: 0;

			const ratingDistribution: Record<number, number> = {
				5: 0,
				4: 0,
				3: 0,
				2: 0,
				1: 0,
			};

			if (reviewsData.totalDocs > 0) {
				for (const review of reviewsData.docs) {
					const rating = review.rating;

					if (rating >= 1 && rating <= 5) {
						ratingDistribution[rating] = (ratingDistribution[rating] ?? 0) + 1;
					}
				}

				for (const key in Object.keys(ratingDistribution)) {
					const rating = Number(key);
					const count = ratingDistribution[rating] || 0;
					ratingDistribution[rating] = Math.round(
						(count / reviewsData.totalDocs) * 100,
					);
				}
			}

			return {
				...product,
				image: product.image as unknown as Media | null,
				tenant: product.tenant as unknown as Tenant & { image: Media | null },
				isPurchased,
				reviewRating,
				reviewCount: reviewsData.totalDocs,
				ratingDistribution,
			};
		}),
	getMany: baseProcedure
		.input(
			z.object({
				cursor: z.number().min(1).default(1),
				limit: z
					.number()
					.max(MAX_PAGINATION_LIMIT)
					.default(DEFAULT_PAGINATION_LIMIT),
				categorySlug: z.string().nullish(),
				minPrice: z.string().nullish(),
				maxPrice: z.string().nullish(),
				tags: z.array(z.string()).nullish(),
				sort: z.enum(sortValues).nullish(),
				tenantSlug: z.string().nullish(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const where: Where = {
				price: {},
			};

			if (input.tenantSlug) {
				where["tenant.slug"] = {
					equals: input.tenantSlug,
				};
			}

			// todo: these are just dummy sorts for now, will revisit soon and add proper ones
			let sort: Sort = "-createdAt";

			if (input.sort === "trending") {
				sort = "-name";
			} else if (input.sort === "hot_and_new") {
				sort = "+name";
			}

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
					depth: 1, // Populate categoy, image and tenant
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

			if (input.tags && input.tags.length > 0) {
				where["tags.name"] = {
					in: input.tags,
				};
			}

			const data = await ctx.payload.find({
				collection: "products",
				depth: 2, // Populate category and image
				where,
				sort,
				page: input.cursor,
				limit: input.limit,
				select: {
					content: false,
				},
			});

			const dataWithSummarisedReviews = await getSummarisedReviews(
				data,
				ctx.payload,
			);
			return {
				...data,
				docs: dataWithSummarisedReviews.map((doc) => ({
					...doc,
					image: doc.image as unknown as Media | null,
					tenant: doc.tenant as unknown as Tenant & { image: Media | null },
				})),
			};
		}),
});
