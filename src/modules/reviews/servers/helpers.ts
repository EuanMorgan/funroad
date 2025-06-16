import type { PaginatedDocs, Payload } from "payload";
import type { Product, Review } from "~/payload-types";

export const getSummarisedReviews = async (
	products: PaginatedDocs<Product>,
	payload: Payload,
) => {
	// Get all product IDs
	const productIds = products.docs.map((doc) => doc.id);

	// Fetch all reviews for these products in a single query
	const reviewsData = await payload.find({
		collection: "reviews",
		pagination: false,
		where: {
			product: {
				in: productIds,
			},
		},
	});

	// Group reviews by product ID
	const reviewsByProduct = reviewsData.docs.reduce<Record<string, Review[]>>(
		(acc, review) => {
			const productId = review.product as string;
			if (!acc[productId]) {
				acc[productId] = [];
			}
			acc[productId].push(review);
			return acc;
		},
		{},
	);

	// Map products with their review summaries
	const dataWithSummarisedReviews = products.docs.map((doc) => {
		const productReviews = reviewsByProduct[doc.id] || [];
		const reviewCount = productReviews.length;
		const reviewRating =
			reviewCount === 0
				? 0
				: productReviews.reduce((acc, review) => acc + review.rating, 0) /
					reviewCount;

		return {
			...doc,
			reviewCount,
			reviewRating,
		};
	});

	return dataWithSummarisedReviews;
};
