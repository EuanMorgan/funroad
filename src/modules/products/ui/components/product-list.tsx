"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useTRPC } from "~/trpc/client";

export const ProductList = ({ categorySlug }: { categorySlug: string }) => {
	const trpc = useTRPC();

	const { data } = useSuspenseQuery(
		trpc.products.getMany.queryOptions({
			categorySlug,
		}),
	);
	return (
		<div>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
};

export const ProductListSkeleton = () => {
	return <div>Loading...</div>;
};
