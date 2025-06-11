import { z } from "zod";
import { DEFAULT_PAGINATION_LIMIT, MAX_PAGINATION_LIMIT } from "~/constants";
import { baseProcedure, createTRPCRouter } from "~/trpc/init";

export const tagsRouter = createTRPCRouter({
	getMany: baseProcedure
		.input(
			z.object({
				cursor: z.number().min(1).default(1),
				limit: z
					.number()
					.max(MAX_PAGINATION_LIMIT)
					.default(DEFAULT_PAGINATION_LIMIT),
			}),
		)
		.query(async ({ ctx, input }) => {
			const data = await ctx.payload.find({
				collection: "tags",
				page: input.cursor,
				limit: input.limit,
			});

			return data;
		}),
});
