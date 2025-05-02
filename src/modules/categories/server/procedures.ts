import type { Category } from "~/payload-types";
import { baseProcedure, createTRPCRouter } from "~/trpc/init";

export const categoriesRouter = createTRPCRouter({
	getMany: baseProcedure.query(async ({ ctx }) => {
		const data = await ctx.payload.find({
			collection: "categories",
			depth: 1, // Populate subcategories
			pagination: false,
			where: {
				parent: {
					exists: false,
				},
			},
			sort: "name",
		});

		const formattedData = data.docs.map((doc) => ({
			...doc,
			subcategories: (doc.subcategories?.docs ?? []).map((sub) => ({
				...(sub as Category),
				subcategories: undefined,
			})),
		}));

		return formattedData;
	}),
});
