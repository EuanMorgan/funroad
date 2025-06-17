"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { DEFAULT_BG_COLOR } from "~/modules/home/constants";
import { BreadcrumbNavigation } from "~/modules/home/ui/components/search-filters/breadcrumb-navigation";
import { Categories } from "~/modules/home/ui/components/search-filters/categories";
import { useProductFilters } from "~/modules/products/hooks/use-product-filters";
import { useTRPC } from "~/trpc/client";
import { SearchInput } from "./search-input";

export const SearchFilters = () => {
	const trpc = useTRPC();

	const { filters, setFilters } = useProductFilters();

	const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

	const params = useParams();

	const categoryParam = params.category as string | undefined;

	const activeCategorySlug = categoryParam ?? "all";

	const activeCategoryData = data.find(
		(cat) => cat.slug === activeCategorySlug,
	);

	const activeCategoryColor = activeCategoryData?.color ?? DEFAULT_BG_COLOR;
	const activeCategoryName = activeCategoryData?.name ?? null;

	const activeSubcategory = params.subcategory as string | undefined;
	const activeSubcategoryName =
		activeCategoryData?.subcategories?.find(
			(subcat) => subcat.slug === activeSubcategory,
		)?.name ?? null;

	return (
		<div
			className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
			style={{ backgroundColor: activeCategoryColor }}
		>
			<SearchInput
				defaultValue={filters.search}
				setFilters={(val) => setFilters({ search: val })}
			/>

			<div className="hidden lg:block">
				<Categories data={data} />
			</div>
			<BreadcrumbNavigation
				activeCategoryName={activeCategoryName}
				activeSubcategoryName={activeSubcategoryName}
				activeCategorySlug={activeCategorySlug}
			/>
		</div>
	);
};

export const SearchFiltersSkeleton = () => {
	return (
		<div
			className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
			style={{ backgroundColor: "#F5F5F5" }}
		>
			<SearchInput disabled defaultValue="" setFilters={() => {}} />
			<div className="hidden lg:block">
				<div className="h-11" />
			</div>
		</div>
	);
};
