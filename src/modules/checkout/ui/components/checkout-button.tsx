import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { cn, generateTenantURL } from "~/lib/utils";
import { useCart } from "~/modules/checkout/hooks/use-cart";

interface CheckoutButtonProps {
	className?: string;
	hideIfEmpty?: boolean;
	tenantSlug: string;
}

export const CheckoutButton = ({
	className,
	hideIfEmpty,
	tenantSlug,
}: CheckoutButtonProps) => {
	const { totalItems } = useCart(tenantSlug);
	if (hideIfEmpty && totalItems === 0) return null;
	return (
		<Button variant={"elevated"} asChild className={cn("bg-white", className)}>
			<Link href={`${generateTenantURL(tenantSlug)}/checkout`}>
				<ShoppingCartIcon className="size-4" />
				{totalItems > 0 ? totalItems : ""}
			</Link>
		</Button>
	);
};
