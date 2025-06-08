import { useQueryStates } from "nuqs";
import { createLoader, parseAsArrayOf, parseAsString } from "nuqs/server";

export const params = {
	minPrice: parseAsString.withOptions({
		clearOnDefault: true,
	}),
	maxPrice: parseAsString.withOptions({
		clearOnDefault: true,
	}),
	tags: parseAsArrayOf(parseAsString).withOptions({
		clearOnDefault: true,
	}),
};

export const useProductFilters = () => {
	const [filters, setFilters] = useQueryStates(params);
	const clear = () => {
		setFilters({
			minPrice: "",
			maxPrice: "",
			tags: [],
		});
	};
	return { filters, setFilters, clear };
};

export const loadProductFilters = createLoader(params);
