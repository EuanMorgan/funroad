import { Suspense } from "react";
import { Footer } from "~/modules/home/ui/components/footer";
import { Navbar } from "~/modules/home/ui/components/navbar";
import {
	SearchFilters,
	SearchFiltersSkeleton,
} from "~/modules/home/ui/components/search-filters";
import { HydrateClient, getQueryClient, trpc } from "~/trpc/server";
export default async function HomeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const queryClient = getQueryClient();
	void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());

	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />
			<HydrateClient>
				<Suspense fallback={<SearchFiltersSkeleton />}>
					<SearchFilters />
				</Suspense>
			</HydrateClient>
			<div className="flex-1 bg-[#F4F4F0]">{children}</div>
			<Footer />
		</div>
	);
}
