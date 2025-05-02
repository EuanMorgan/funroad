"use client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/client";
import { getQueryClient, trpc } from "~/trpc/server";

export default function Home() {
	const trpc = useTRPC();
	const categories = useQuery(trpc.categories.getMany.queryOptions());

	return <div>home page</div>;
}
