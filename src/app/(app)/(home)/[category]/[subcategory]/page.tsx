import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { loadProductFilters } from "~/modules/products/search-params";
import {
	ProductList,
	ProductListSkeleton,
} from "~/modules/products/ui/components/product-list";
import ProductListView from "~/modules/products/ui/views/product-list-view";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

interface Props {
	params: Promise<{
		subcategory: string;
	}>;
	searchParams: Promise<SearchParams>;
}

export default async function CategoryPage({ params, searchParams }: Props) {
	const { subcategory } = await params;
	const filters = await loadProductFilters(searchParams);

	void prefetch(
		trpc.products.getMany.queryOptions({
			categorySlug: subcategory,
			...filters,
		}),
	);

	return (
		<HydrateClient>
			<ProductListView categorySlug={subcategory} />
		</HydrateClient>
	);
}
