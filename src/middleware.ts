import { type NextRequest, NextResponse } from "next/server";
import { env } from "~/env";

export const config = {
	matcher: [
		/**
		 * Match all paths except for:
		 * - api routes
		 * - _next (Next.js internals)
		 * - _static (inside /public)
		 * - all root files inside /public e.g. /favicon.ico
		 */
		"/((?!api/|_next/|_static/|_vercel|media/|[\\w-]+\\.\\w+).*)",
	],
};

export default async function middleware(req: NextRequest) {
	const url = req.nextUrl;

	const hostname = req.headers.get("host") ?? "";

	const rootDomain = env.NEXT_PUBLIC_ROOT_DOMAIN;

	if (hostname.endsWith(`.${rootDomain}`)) {
		const tenantSlug = hostname.replace(`.${rootDomain}`, "");

		return NextResponse.rewrite(
			new URL(`/tenants/${tenantSlug}${url.pathname}${url.search}`, req.url),
		);
	}

	return NextResponse.next();
}
