import { parseAsString, useQueryStates } from "nuqs";

export const useProductFilters = () => {
	return useQueryStates({
		categorySlug: parseAsString.withOptions({
			clearOnDefault: true,
		}),
		minPrice: parseAsString.withOptions({
			clearOnDefault: true,
		}),
		maxPrice: parseAsString.withOptions({
			clearOnDefault: true,
		}),
	});
};
