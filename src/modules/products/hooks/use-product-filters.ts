import { useQueryStates } from "nuqs";
import { params } from "~/modules/products/search-params";

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
