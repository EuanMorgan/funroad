import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createReviewSchema } from "~/modules/library/schemas";
import { createTRPCRouter, protectedProcedure } from "~/trpc/init";

export const reviewsRouter = createTRPCRouter({
	getOne: protectedProcedure
		.input(
			z.object({
				productId: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
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

			const reviewsData = await ctx.payload.find({
				collection: "reviews",
				limit: 1,
				where: {
					and: [
						{
							product: {
								equals: product.id,
							},
						},
						{
							user: {
								equals: ctx.session.user.id,
							},
						},
					],
				},
			});

			const review = reviewsData.docs[0];

			if (!review) {
				return null;
			}

			return review;
		}),

	create: protectedProcedure
		.input(
			createReviewSchema.extend({
				productId: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
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

			const existingReviewData = await ctx.payload.find({
				collection: "reviews",
				limit: 1,
				where: {
					and: [
						{
							product: {
								equals: product.id,
							},
						},
						{
							user: {
								equals: ctx.session.user.id,
							},
						},
					],
				},
			});

			if (existingReviewData.totalDocs > 0) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "You have already reviewed this product",
				});
			}

			const review = await ctx.payload.create({
				collection: "reviews",
				data: {
					user: ctx.session.user.id,
					product: product.id,
					description: input.description,
					rating: input.rating,
				},
			});

			return review;
		}),
	update: protectedProcedure
		.input(
			createReviewSchema.extend({
				reviewId: z.string(),
				description: z.string().min(3, { message: "Description is required" }),
				rating: z.number().min(1, { message: "Rating is required" }).max(5),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const existingReviewData = await ctx.payload.findByID({
				depth: 0, // existingReview.user is the user ID
				collection: "reviews",
				id: input.reviewId,
			});

			if (!existingReviewData) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Review not found",
				});
			}

			if (existingReviewData.user !== ctx.session.user.id) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You are not allowed to update this review",
				});
			}

			const updatedReview = await ctx.payload.update({
				collection: "reviews",
				id: input.reviewId,
				data: {
					description: input.description,
					rating: input.rating,
				},
			});

			return updatedReview;
		}),
});
