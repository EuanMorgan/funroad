import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URI: z.string().url(),
		PAYLOAD_SECRET: z.string(),
		STRIPE_SECRET_KEY: z.string(),
		STRIPE_WEBHOOK_SECRET: z.string(),
	},
	client: {
		NEXT_PUBLIC_BASE_URL: z.string().url(),
	},
	experimental__runtimeEnv: {
		NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
	},
});
