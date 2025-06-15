import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { useCartStore } from "~/modules/checkout/store/use-cart-store";

export const useCart = (tenantSlug: string) => {
	const addProduct = useCartStore((state) => state.addProduct);
	const removeProduct = useCartStore((state) => state.removeProduct);
	const clearAllCarts = useCartStore((state) => state.clearAllCarts);
	const clearCart = useCartStore((state) => state.clearCart);

	const productIds = useCartStore(
		useShallow((state) => state.tenantCarts[tenantSlug]?.productIds || []),
	);

	const toggleProduct = useCallback(
		(productId: string) => {
			if (productIds.includes(productId)) {
				removeProduct(tenantSlug, productId);
			} else {
				addProduct(tenantSlug, productId);
			}
		},
		[addProduct, removeProduct, productIds, tenantSlug],
	);

	const isProductInCart = useCallback(
		(productId: string) => {
			return productIds.includes(productId);
		},
		[productIds],
	);

	const clearTenantCart = useCallback(() => {
		clearCart(tenantSlug);
	}, [tenantSlug, clearCart]);

	const handleAddProduct = useCallback(
		(productId: string) => addProduct(tenantSlug, productId),
		[addProduct, tenantSlug],
	);

	const handleRemoveProduct = useCallback(
		(productId: string) => removeProduct(tenantSlug, productId),
		[removeProduct, tenantSlug],
	);

	return {
		productIds,
		addProduct: handleAddProduct,
		removeProduct: handleRemoveProduct,
		clearTenantCart,
		isProductInCart,
		toggleProduct,
		clearAllCarts,
		totalItems: productIds.length,
	};
};
