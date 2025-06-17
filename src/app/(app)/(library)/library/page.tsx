import { LibraryView } from "~/modules/library/ui/views/library-view";
import { HydrateClient, getQueryClient, trpc } from "~/trpc/server";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
	const queryClient = getQueryClient();
	void queryClient.prefetchInfiniteQuery(
		trpc.library.getMany.infiniteQueryOptions({}),
	);
	return (
		<HydrateClient>
			<LibraryView />
		</HydrateClient>
	);
}
