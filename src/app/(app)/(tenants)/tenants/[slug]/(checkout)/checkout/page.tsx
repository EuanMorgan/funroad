import { CheckoutView } from "~/modules/checkout/ui/views/checkout-view";

interface PageProps {
	params: Promise<{ slug: string }>;
}

export default async function CheckoutPage({ params }: PageProps) {
	const { slug } = await params;

	// const queryClient = getQueryClient();
	// void queryClient.prefetchQuery(trpc.tenants.getone.queryOptions({ slug }));

	return <CheckoutView tenantSlug={slug} />;
}
