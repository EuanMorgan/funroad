import { authRouter } from "~/modules/auth/server/procedures";
import { categoriesRouter } from "~/modules/categories/server/procedures";
import { checkoutRouter } from "~/modules/checkout/server/procedures";
import { libraryRouter } from "~/modules/library/server/procedures";
import { productsRouter } from "~/modules/products/server/procedures";
import { reviewsRouter } from "~/modules/reviews/servers/procedures";
import { tagsRouter } from "~/modules/tags/server/procedures";
import { tenantsRouter } from "~/modules/tenants/server/procedures";

import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
	auth: authRouter,
	categories: categoriesRouter,
	checkout: checkoutRouter,
	library: libraryRouter,
	products: productsRouter,
	reviews: reviewsRouter,
	tags: tagsRouter,
	tenants: tenantsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
