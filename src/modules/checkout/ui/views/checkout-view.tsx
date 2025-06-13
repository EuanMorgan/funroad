"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { EmptyState } from "~/components/empty-state";
import { generateTenantURL } from "~/lib/utils";
import { useCart } from "~/modules/checkout/hooks/use-cart";
import { CheckoutItem } from "~/modules/checkout/ui/components/checkout-item";
import { CheckoutSidebar } from "~/modules/checkout/ui/components/checkout-sidebar";
import { useTRPC } from "~/trpc/client";

interface CheckoutViewProps {
	tenantSlug: string;
}

export const CheckoutView = ({ tenantSlug }: CheckoutViewProps) => {
	const trpc = useTRPC();
	const { productIds, clearAllCarts, removeProduct } = useCart(tenantSlug);

	const { data, error, isPlaceholderData, isLoading } = useQuery(
		trpc.checkout.getProducts.queryOptions(
			{
				ids: productIds,
			},
			{
				placeholderData: keepPreviousData,
			},
		),
	);

	useEffect(() => {
		if (!error) return;

		if (error.data?.code === "NOT_FOUND") {
			toast.error("Some products were not found");
			clearAllCarts();
		}
	}, [error, clearAllCarts]);

	if (data?.totalDocs === 0) {
		return (
			<div className="lg:pt-16 pt-4 px-4 lg:px-12">
				<EmptyState message="No products found" />
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="lg:pt-16 pt-4 px-4 lg:px-12">
				<div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
					<LoaderIcon className="animate-spin text-muted-foreground" />
				</div>
			</div>
		);
	}

	return (
		<div className="lg:pt-16 pt-4 px-4 lg:px-12">
			<div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
				<div className="lg:col-span-4">
					<div className="border rounded-md overflow-hidden bg-white">
						{data?.docs.map((product, index) => (
							<CheckoutItem
								key={product.id}
								isLast={index === data?.docs.length - 1}
								imageUrl={product.image?.url}
								name={product.name}
								productUrl={`${generateTenantURL(product.tenant.slug)}/products/${product.id}`}
								tenantUrl={generateTenantURL(product.tenant.slug)}
								tenantName={product.tenant.name}
								price={product.price}
								onRemove={() => removeProduct(product.id)}
								isLoading={isPlaceholderData || isLoading}
							/>
						))}
					</div>
				</div>
				<div className="lg:col-span-3">
					<CheckoutSidebar
						total={data?.totalPrice || 0}
						onCheckout={() => {}}
						isCancelled={false}
						isPending={false}
					/>
				</div>
			</div>
		</div>
	);
};
