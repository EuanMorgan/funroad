"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { EmptyState } from "~/components/empty-state";
import { Button } from "~/components/ui/button";
import { DEFAULT_PAGINATION_LIMIT } from "~/constants";

import { useTRPC } from "~/trpc/client";
import { ProductCard, ProductCardSkeleton } from "./product-card";

export const ProductList = () => {
	const trpc = useTRPC();

	const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
		useSuspenseInfiniteQuery(
			trpc.library.getMany.infiniteQueryOptions(
				{},
				{
					getNextPageParam: (lastPage) =>
						lastPage.docs.length > 0 ? lastPage.nextPage : undefined,
				},
			),
		);

	if (data.pages.every((p) => p.docs.length === 0)) {
		return <EmptyState message="No products found" />;
	}
	return (
		<>
			<div
				className={
					"grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
				}
			>
				{data?.pages
					.flatMap((page) => page.docs)
					.map((product) => (
						<ProductCard
							key={product.id}
							id={product.id}
							name={product.name}
							imageUrl={product.image?.url}
							tenantSlug={product.tenant?.slug}
							tenantImageUrl={product.tenant?.image?.url}
							reviewRating={product.reviewRating}
							reviewCount={product.reviewCount}
						/>
					))}
			</div>
			<div className="flex justify-center pt-8">
				{hasNextPage && (
					<Button
						disabled={isFetchingNextPage}
						onClick={() => fetchNextPage()}
						className="font-medium disabled:opacity-50 text-base bg-white"
						variant={"elevated"}
					>
						{isFetchingNextPage ? "Loading..." : "Load more"}
					</Button>
				)}
			</div>
		</>
	);
};

export const ProductListSkeleton = () => {
	return (
		<div
			className={
				"grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
			}
		>
			{Array.from({ length: DEFAULT_PAGINATION_LIMIT }).map((_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: ignore
				<ProductCardSkeleton key={i} />
			))}
		</div>
	);
};
