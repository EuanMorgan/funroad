import { Suspense } from "react";
import { Footer } from "~/app/(app)/(home)/footer";
import { Navbar } from "~/app/(app)/(home)/navbar";
import {
	SearchFilters,
	SearchFiltersSkeleton,
} from "~/app/(app)/(home)/search-filters";
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
