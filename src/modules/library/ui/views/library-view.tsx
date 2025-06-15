import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import {
	ProductList,
	ProductListSkeleton,
} from "~/modules/library/ui/components/product-list";

export const LibraryView = () => {
	return (
		<div className="min-h-screen bg-white">
			<nav className="p-4 bg-[#F4F4F0] w-full border-b">
				<Link href="/" prefetch className="flex items-center gap-2">
					<ArrowLeftIcon className="size-4" />
					<span className="font-medium">Continue shopping</span>
				</Link>
			</nav>
			<header className="bg-[#F4F4F0] py-8 border-b">
				<div className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 flex flex-col gap-y-4">
					<h1 className="text-[2.5rem] font-medium">Library</h1>
					<p className="font-medium">Your purchases and reviews</p>
				</div>
			</header>

			<section className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 py-10">
				<Suspense fallback={<ProductListSkeleton />}>
					<ProductList />
				</Suspense>
			</section>
		</div>
	);
};
