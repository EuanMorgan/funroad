import { type ReactNode, Suspense } from "react";
import { Footer } from "~/modules/tenants/ui/components/footer";
import { Navbar, NavbarSkeleton } from "~/modules/tenants/ui/components/navbar";
import { getQueryClient, HydrateClient, trpc } from "~/trpc/server";

interface Props {
	children: ReactNode;
	params: Promise<{ slug: string }>;
}

export default async function Layout({ children, params }: Props) {
	const { slug } = await params;

	const queryClient = getQueryClient();

	void queryClient.prefetchQuery(trpc.tenants.getone.queryOptions({ slug }));

	return (
		<div className="min-h-screen bg-[#F4F4F0] flex flex-col">
			<HydrateClient>
				<Suspense fallback={<NavbarSkeleton />}>
					<Navbar slug={slug} />
				</Suspense>
			</HydrateClient>
			<div className="flex-1">
				<div className="max-w-(--breakpoint-xl) mx-auto">{children}</div>
			</div>
			<Footer />
		</div>
	);
}
