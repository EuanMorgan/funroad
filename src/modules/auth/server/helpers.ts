import "server-only";
import { TRPCError } from "@trpc/server";
import { cookies as getCookies } from "next/headers";
import type { Payload } from "payload";
import { env } from "~/env";

export const login = async (
	payload: Payload,
	input: { email: string; password: string },
) => {
	const data = await payload.login({
		collection: "users",
		data: input,
	});

	if (!data.token) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Invalid email or password",
		});
	}
	await setAuthCookie(payload, data.token);

	return data;
};

export const setAuthCookie = async (payload: Payload, token: string) => {
	const cookies = await getCookies();
	cookies.set({
		name: `${payload.config.cookiePrefix}-token`,
		value: token,
		httpOnly: true,
		maxAge: 60 * 60 * 24 * 30, // 30 days
		path: "/",
		...(process.env.NODE_ENV !== "development" && {
			secure: true,
			sameSite: "none",
			domain: env.NEXT_PUBLIC_ROOT_DOMAIN,
		}),
	});
};
