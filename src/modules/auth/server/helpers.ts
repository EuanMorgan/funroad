import { TRPCError } from "@trpc/server";
import { cookies as getCookies } from "next/headers";
import type { Payload } from "payload";
import { AUTH_COOKIE } from "~/modules/auth/constants";

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

	const cookies = await getCookies();
	cookies.set({
		name: AUTH_COOKIE,
		value: data.token,
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 60 * 24 * 30, // 30 days
		path: "/",
		// sameSite: "none",
		// domain:""
		// TODO: Ensure cross-domain cookie sharing
	});

	return data;
};
