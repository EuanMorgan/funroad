import Link from "next/link";
import { Button } from "~/components/ui/button";
import { env } from "~/env";
import { cn } from "~/lib/utils";
import { useCart } from "~/modules/checkout/hooks/use-cart";

interface CartButtonProps {
	tenantSlug: string;
	productId: string;
	isPurchased?: boolean;
}

export const CartButton = ({
	tenantSlug,
	productId,
	isPurchased,
}: CartButtonProps) => {
	const cart = useCart(tenantSlug);

	if (isPurchased) {
		return (
			<Button
				variant={"elevated"}
				asChild
				className="flex-1 font-medium bg-white"
			>
				<Link href={`${env.NEXT_PUBLIC_BASE_URL}/library/${productId}`}>
					View in Library
				</Link>
			</Button>
		);
	}
	return (
		<Button
			variant={"elevated"}
			className={cn(
				"flex-1 bg-pink-400",
				cart.isProductInCart(productId) && "bg-white",
			)}
			onClick={() => cart.toggleProduct(productId)}
		>
			{cart.isProductInCart(productId) ? "Remove from cart" : "Add to cart"}
		</Button>
	);
};
