import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import { env as _validateEnvAtBuildTime } from "./src/env";

const nextConfig: NextConfig = {
	// We typecheck and lint in CI so don't want these to stop builds succeeding
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "funroad.euanmorgan.uk",
			},
			{
				protocol: "http",
				hostname: "localhost",
			},
		],
	},
	output: "standalone",
	transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
};

export default withPayload(nextConfig);
