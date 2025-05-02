import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "~/components/ui/sheet";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CustomCategory } from "~/app/(app)/(home)/types";
import { ScrollArea } from "~/components/ui/scroll-area";

interface CategoriesSidebarProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	data: CustomCategory[];
}

export const CategoriesSidebar = ({
	open,
	onOpenChange,
	data,
}: CategoriesSidebarProps) => {
	const [parentCategories, setParentCategories] = useState<
		CustomCategory[] | null
	>(null);
	const [selectedCategory, setSelectedCategory] =
		useState<CustomCategory | null>(null);

	// If we have parent categories, show them otherwise show root
	const currentCategories = parentCategories ?? data ?? [];

	const router = useRouter();

	const handleOpenChange = (open: boolean) => {
		setParentCategories(null);
		setSelectedCategory(null);
		onOpenChange(open);
	};

	const handleCategoryClick = (category: CustomCategory) => {
		if (category.subcategories && category.subcategories.length > 0) {
			setParentCategories(category.subcategories as CustomCategory[]);
			setSelectedCategory(category);
		} else {
			// leaf category, no sub categories
			if (parentCategories && selectedCategory) {
				// subcategory
				router.push(`/${selectedCategory.slug}/${category.slug}`);
			} else {
				// main
				if (category.slug === "all") {
					router.push("/");
				} else {
					router.push(`/${category.slug}`);
				}
			}

			handleOpenChange(false);
		}
	};

	const handleBackClick = () => {
		if (parentCategories) {
			setParentCategories(null);
			setSelectedCategory(null);
		}
	};

	const backgroundColor = selectedCategory?.color ?? "white";

	return (
		<Sheet open={open} onOpenChange={handleOpenChange}>
			<SheetContent
				side="left"
				className="p-0 transition-none transition-colors duration-75"
				style={{ backgroundColor }}
			>
				<SheetHeader className="p-4 border-b">
					<SheetTitle>Categories</SheetTitle>
				</SheetHeader>
				<ScrollArea className="flex flesx-col overflow-y-auto h-full pb-2">
					{parentCategories && (
						<button
							type="button"
							onClick={handleBackClick}
							className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-md cursor-pointer"
						>
							<ChevronLeftIcon className="size-4 mr-2" />
							Back
						</button>
					)}
					{currentCategories.map((category) => (
						<button
							type="button"
							key={category.id}
							className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center justify-between text-base font-md cursor-pointer"
							onClick={() => handleCategoryClick(category)}
						>
							{category.name}
							{category.subcategories && category.subcategories.length > 0 && (
								<ChevronRightIcon className="size-4" />
							)}
						</button>
					))}
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
};
