import { z } from "zod";

export const createReviewSchema = z.object({
	description: z.string().min(3, { message: "Description is required" }),
	rating: z.number().min(1, { message: "Rating is required" }).max(5),
});

export type CreateReviewSchema = z.infer<typeof createReviewSchema>;
