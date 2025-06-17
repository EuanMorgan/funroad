import { Suspense } from "react";
import {
	ProductView,
	ProductViewSkeleton,
} from "~/modules/library/ui/views/product-view";
import { HydrateClient, getQueryClient, trpc } from "~/trpc/server";

export const dynamic = "force-dynamic";

interface Props {
	params: Promise<{ productId: string }>;
}
export default async function LibraryPage({ params }: Props) {
	const queryClient = getQueryClient();
	const { productId } = await params;
	void queryClient.prefetchQuery(
		trpc.library.getOne.queryOptions({ productId }),
	);
	void queryClient.prefetchQuery(
		trpc.reviews.getOne.queryOptions({ productId }),
	);
	return (
		<HydrateClient>
			<Suspense fallback={<ProductViewSkeleton />}>
				<ProductView productId={productId} />
			</Suspense>
		</HydrateClient>
	);
}
