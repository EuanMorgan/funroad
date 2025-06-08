import type { SearchParams } from "nuqs/server";

import { Suspense } from "react";
import { loadProductFilters } from "~/modules/products/hooks/use-product-filters";
import { ProductFilters } from "~/modules/products/ui/components/product-filters";
import {
	ProductList,
	ProductListSkeleton,
} from "~/modules/products/ui/components/product-list";
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

	console.log({ filters }, "rsc");

	void prefetch(
		trpc.products.getMany.queryOptions({
			categorySlug: category,
			...filters,
		}),
	);

	return (
		<HydrateClient>
			<div className="px-4 lg:px-12 py-8 flex flex-col gap-4">
				<div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12">
					<div className="lg:col-span-2 xl:col-span-2">
						<ProductFilters />
					</div>
					<div className="lg:col-span-4 xl:col-span-6">
						<Suspense fallback={<ProductListSkeleton />}>
							<ProductList categorySlug={category} />
						</Suspense>
					</div>
				</div>
			</div>
		</HydrateClient>
	);
}
