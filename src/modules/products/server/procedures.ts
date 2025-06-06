import type { Category } from "~/payload-types";
import { baseProcedure, createTRPCRouter } from "~/trpc/init";

export const productsRouter = createTRPCRouter({
	getMany: baseProcedure.query(async ({ ctx }) => {
		const data = await ctx.payload.find({
			collection: "products",
			depth: 1, // Populate category and image
		});

		return data;
	}),
});
