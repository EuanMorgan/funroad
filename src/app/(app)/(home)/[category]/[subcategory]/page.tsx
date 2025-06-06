import { Suspense } from "react";
import {
	ProductList,
	ProductListSkeleton,
} from "~/modules/products/ui/components/product-list";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

interface Props {
	params: Promise<{
		subcategory: string;
	}>;
}

export default async function CategoryPage({ params }: Props) {
	const { subcategory } = await params;

	void prefetch(
		trpc.products.getMany.queryOptions({
			categorySlug: subcategory,
		}),
	);

	return (
		<HydrateClient>
			<Suspense fallback={<ProductListSkeleton />}>
				<ProductList categorySlug={subcategory} />
			</Suspense>
		</HydrateClient>
	);
}
