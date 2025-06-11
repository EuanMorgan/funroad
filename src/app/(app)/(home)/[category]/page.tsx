import type { SearchParams } from "nuqs/server";

import { loadProductFilters } from "~/modules/products/search-params";
import ProductListView from "~/modules/products/ui/views/product-list-view";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

interface Props {
	params: Promise<{
		category: string;
	}>;
	searchParams: Promise<SearchParams>;
}

export default async function CategoryPage({ params, searchParams }: Props) {
	const { category } = await params;
	const filters = await loadProductFilters(searchParams);

	void prefetch(
		trpc.products.getMany.queryOptions({
			categorySlug: category,
			...filters,
		}),
	);

	return (
		<HydrateClient>
			<ProductListView categorySlug={category} />
		</HydrateClient>
	);
}
