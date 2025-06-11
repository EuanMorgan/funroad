import "server-only"; // <-- ensure this file cannot be imported from the client
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import {
	type TRPCQueryOptions,
	createTRPCOptionsProxy,
} from "@trpc/tanstack-react-query";
import { cache } from "react";
import { createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";
// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);
export const trpc = createTRPCOptionsProxy({
	ctx: createTRPCContext,
	router: appRouter,
	queryClient: getQueryClient,
});

export function HydrateClient(props: { children: React.ReactNode }) {
	const queryClient = getQueryClient();
	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			{props.children}
		</HydrationBoundary>
	);
}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
	queryOptions: T,
) {
	const queryClient = getQueryClient();
	if (queryOptions.queryKey[1]?.type === "infinite") {
		console.log("prefetching infinite query");
		console.log(queryOptions.queryKey);
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		void queryClient.prefetchInfiniteQuery(queryOptions as any);
	} else {
		console.log("prefetching query");
		console.log(queryOptions.queryKey);
		void queryClient.prefetchQuery(queryOptions);
	}
}

export const caller = appRouter.createCaller(createTRPCContext);
