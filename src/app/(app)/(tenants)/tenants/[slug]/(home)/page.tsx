import type { SearchParams } from "nuqs";
import { loadProductFilters } from "~/modules/products/search-params";
import ProductListView from "~/modules/products/ui/views/product-list-view";
import { HydrateClient, getQueryClient, trpc } from "~/trpc/server";

interface Props {
	searchParams: Promise<SearchParams>;
	params: Promise<{ slug: string }>;
}

export default async function TenantPage({ searchParams, params }: Props) {
	const { slug } = await params;
	const filters = await loadProductFilters(searchParams);

	const queryClient = getQueryClient();
	void queryClient.prefetchInfiniteQuery(
		trpc.products.getMany.infiniteQueryOptions({
			...filters,
			tenantSlug: slug,
		}),
	);

	return (
		<HydrateClient>
			<ProductListView tenantSlug={slug} narrowView={true} />
		</HydrateClient>
	);
}
