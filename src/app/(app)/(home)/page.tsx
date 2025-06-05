"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/client";

export default function Home() {
	const trpc = useTRPC();
	const { data: session } = useQuery(trpc.auth.session.queryOptions());
	console.log(session);
	return <div>{JSON.stringify(session?.user, null, 2)}</div>;
}
