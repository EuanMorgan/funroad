import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { env } from "~/env";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function generateTenantURL(tenantSlug: string) {
	const isDev = process.env.NODE_ENV === "development";
	const isSubdomainRoutingEnabled = env.NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING;

	// In dev or subdomain routing is disabled use normal routing
	if (isDev || !isSubdomainRoutingEnabled) {
		return `${env.NEXT_PUBLIC_BASE_URL}/tenants/${tenantSlug}`;
	}

	const protocol = "https";
	const domain = env.NEXT_PUBLIC_ROOT_DOMAIN;

	// In prod use tenant subdomain
	return `${protocol}://${tenantSlug}.${domain}`;
}

export function formatCurrency(amount: number | string) {
	return new Intl.NumberFormat("en-GB", {
		style: "currency",
		currency: "GBP",
		maximumFractionDigits: 2,
		minimumFractionDigits: 0,
	}).format(Number(amount));
}
