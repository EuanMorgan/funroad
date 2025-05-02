import type { Category } from "~/payload-types";

export type CustomCategory = Category & {
	subcategories: Category[];
};
