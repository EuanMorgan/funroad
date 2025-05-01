import { SearchInput } from "./search-input";

interface SearchFiltersProps {
	data: any;
}

export const SearchFilters = ({ data }: SearchFiltersProps) => {
	return (
		<div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full">
			<SearchInput />
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
};
