"use client";

import { useMutation } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useTRPC } from "~/trpc/client";

const StripeVerifyPage = () => {
	const trpc = useTRPC();
	const verify = useMutation(
		trpc.checkout.verify.mutationOptions({
			onSuccess: (data) => {
				window.location.href = data.url;
			},
			onError: (error) => {
				window.location.href = "/";
				toast.error(error.message);
			},
		}),
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: no infinite loop pls
	useEffect(() => {
		verify.mutate();
	}, []);
	return (
		<div className="flex min-h-screen items-center justify-center">
			<LoaderIcon className="animate-spin text-black" />
		</div>
	);
};

export default StripeVerifyPage;
