import type { PaginatedDocs, Payload } from "payload";
import type { Product } from "~/payload-types";

export const getSummarisedReviews = async (
	products: PaginatedDocs<Product>,
	payload: Payload,
) => {
	const dataWithSummarisedReviews = await Promise.all(
		products.docs.map(async (doc) => {
			const reviewsData = await payload.find({
				collection: "reviews",
				pagination: false,
				where: {
					product: {
						equals: doc.id,
					},
				},
			});

			return {
				...doc,
				reviewCount: reviewsData.totalDocs,
				reviewRating:
					reviewsData.docs.length === 0
						? 0
						: reviewsData.docs.reduce((acc, review) => acc + review.rating, 0) /
							reviewsData.totalDocs,
			};
		}),
	);

	return dataWithSummarisedReviews;
};
