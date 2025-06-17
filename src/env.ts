import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URI: z.string().url(),
		PAYLOAD_SECRET: z.string(),
		STRIPE_SECRET_KEY: z.string(),
		STRIPE_WEBHOOK_SECRET: z.string(),
		BLOB_READ_WRITE_TOKEN: z.string(),
	},
	client: {
		NEXT_PUBLIC_BASE_URL: z.string().url(),
		NEXT_PUBLIC_ROOT_DOMAIN: z.string(),
		NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING: z.enum(["true", "false"]),
	},
	experimental__runtimeEnv: {
		NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
		NEXT_PUBLIC_ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
		NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING:
			process.env.NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING,
	},
});
