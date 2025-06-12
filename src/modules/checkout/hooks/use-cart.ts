import { useCartStore } from "~/modules/checkout/store/use-cart-store";

export const useCart = (tenantSlug: string) => {
	const {
		getCartByTenant,
		addProduct,
		removeProduct,
		clearAllCarts,
		clearCart,
	} = useCartStore();

	const productIds = getCartByTenant(tenantSlug);

	const toggleProduct = (productId: string) => {
		if (productIds.includes(productId)) {
			removeProduct(tenantSlug, productId);
		} else {
			addProduct(tenantSlug, productId);
		}
	};

	const isProductInCart = (productId: string) => {
		return productIds.includes(productId);
	};

	const clearTenantCart = () => {
		clearCart(tenantSlug);
	};

	return {
		productIds,
		addProduct: (productId: string) => addProduct(tenantSlug, productId),
		removeProduct: (productId: string) => removeProduct(tenantSlug, productId),
		clearTenantCart,
		isProductInCart,
		toggleProduct,
		clearAllCarts,
		totalItems: productIds.length,
	};
};
