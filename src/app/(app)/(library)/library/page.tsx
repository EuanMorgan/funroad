import { LibraryView } from "~/modules/library/ui/views/library-view";
import { HydrateClient, getQueryClient, trpc } from "~/trpc/server";

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
