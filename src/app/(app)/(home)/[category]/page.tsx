import { Suspense } from "react";
import {
	ProductList,
	ProductListSkeleton,
} from "~/modules/products/ui/components/product-list";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

interface Props {
	params: Promise<{
		category: string;
	}>;
}

export default async function CategoryPage({ params }: Props) {
	const { category } = await params;

	void prefetch(
		trpc.products.getMany.queryOptions({
			categorySlug: category,
		}),
	);

	return (
		<HydrateClient>
			<Suspense fallback={<ProductListSkeleton />}>
				<ProductList categorySlug={category} />
			</Suspense>
		</HydrateClient>
	);
}
