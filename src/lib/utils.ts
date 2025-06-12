import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function generateTenantURL(tenantSlug: string) {
	return `/tenants/${tenantSlug}`;
}

export function formatCurrency(amount: number | string) {
	return new Intl.NumberFormat("en-GB", {
		style: "currency",
		currency: "GBP",
		maximumFractionDigits: 2,
		minimumFractionDigits: 0,
	}).format(Number(amount));
}
