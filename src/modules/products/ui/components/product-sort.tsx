"use client";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useProductFilters } from "~/modules/products/hooks/use-product-filters";
import { sortValues } from "~/modules/products/search-params";

export const ProductSort = () => {
	const { filters, setFilters } = useProductFilters();

	const formatSortLabel = (sort: string) => {
		const remapped = sort.replaceAll("_", " ").replace("and", "&");
		return remapped.charAt(0).toUpperCase() + remapped.slice(1);
	};

	return (
		<div className="flex items-center gap-2">
			{sortValues.map((sort) => (
				<Button
					key={sort}
					size="sm"
					className={cn(
						"rounded-full bg-white hover:bg-white",
						filters.sort !== sort &&
							"bg-transparent border-transparent hover:border-border hover:bg-transparent",
					)}
					variant={"secondary"}
					onClick={() => setFilters({ sort })}
				>
					{formatSortLabel(sort)}
				</Button>
			))}
		</div>
	);
};
