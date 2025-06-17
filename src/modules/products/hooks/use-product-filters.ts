import { useQueryStates } from "nuqs";
import { params } from "~/modules/products/search-params";

export const useProductFilters = () => {
	const [filters, setFilters] = useQueryStates(params, {
		shallow: true,
		limitUrlUpdates: {
			method: "debounce",
			timeMs: 500,
		},
	});
	const clear = () => {
		setFilters({
			minPrice: "",
			maxPrice: "",
			tags: [],
			search: "",
			sort: "curated",
		});
	};
	return { filters, setFilters, clear };
};
