import { CategoryDropdown } from "~/app/(app)/(home)/search-filters/category-dropdown";

interface CategoriesProps {
	data: any;
}

export const Categories = ({ data }: CategoriesProps) => {
	return (
		<div className="relative w-full">
			<div className="flex flex-nowrap items-center">
				{data.map((category: any) => (
					<div key={category.id}>
						<CategoryDropdown
							category={category}
							isActive={false}
							isNavigationHovered={false}
						/>
					</div>
				))}
			</div>
		</div>
	);
};
