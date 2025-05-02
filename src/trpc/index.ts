import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { appRouter } from "./routers/_app";

export type RouterInputs = inferRouterInputs<typeof appRouter>;
export type RouterOutputs = inferRouterOutputs<typeof appRouter>;
