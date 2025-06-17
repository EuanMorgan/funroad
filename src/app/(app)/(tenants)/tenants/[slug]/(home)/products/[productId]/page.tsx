import { Suspense } from "react";
import {
	ProductView,
	ProductViewSkeleton,
} from "~/modules/products/ui/views/product-view";
import { HydrateClient, getQueryClient, trpc } from "~/trpc/server";

interface Props {
	params: Promise<{ productId: string; slug: string }>;
}

export default async function ProductPage({ params }: Props) {
	const { productId, slug } = await params;

	const queryClient = getQueryClient();
	void queryClient.prefetchQuery(
		trpc.products.getOne.queryOptions({
			id: productId,
		}),
	);

	return (
		<HydrateClient>
			<Suspense fallback={<ProductViewSkeleton />}>
				<ProductView productId={productId} tenantSlug={slug} />
			</Suspense>
		</HydrateClient>
	);
}
