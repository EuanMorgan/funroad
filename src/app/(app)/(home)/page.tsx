import type { SearchParams } from "nuqs/server";

import { loadProductFilters } from "~/modules/products/search-params";
import ProductListView from "~/modules/products/ui/views/product-list-view";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

interface Props {
	searchParams: Promise<SearchParams>;
}

export default async function CategoryPage({ searchParams }: Props) {
	const filters = await loadProductFilters(searchParams);

	void prefetch(
		trpc.products.getMany.infiniteQueryOptions({
			...filters,
		}),
	);

	return (
		<HydrateClient>
			<ProductListView />
		</HydrateClient>
	);
}
