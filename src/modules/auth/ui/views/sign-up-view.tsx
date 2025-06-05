"use client";

import { useMutation } from "@tanstack/react-query";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	useForm,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { type RegisterSchema, registerSchema } from "~/modules/auth/schemas";
import { useTRPC } from "~/trpc/client";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["700"],
});

export const SignUpView = () => {
	const router = useRouter();

	const form = useForm({
		schema: registerSchema,
		defaultValues: {
			email: "",
			password: "",
			username: "",
		},
		mode: "all",
	});

	const username = form.watch("username");
	const usernameErrors = form.formState.errors.username;

	const showPreview = username && !usernameErrors;

	const trpc = useTRPC();

	const register = useMutation(
		trpc.auth.register.mutationOptions({
			onError: (error) => {
				toast.error(error.message);
			},
			onSuccess: () => {
				router.push("/");
			},
		}),
	);

	const onSubmit = async (value: RegisterSchema) => {
		await register.mutateAsync(value);
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-5">
			<div className="bg-[#F4F4F0] h-screen w-full lg:col-span-3 overflow-y-auto">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-8 p-4 lg:p-16"
					>
						<div className="flex items-center justify-between mb-8">
							<Link href="/">
								<span
									className={cn("text-2xl font-semibold", poppins.className)}
								>
									funroad
								</span>
							</Link>
							<Button
								asChild
								variant={"ghost"}
								size="sm"
								className="text-base border-none underline"
							>
								<Link href="/sign-in" prefetch>
									Sign in
								</Link>
							</Button>
						</div>
						<h1 className="text-4xl font-medium">
							Join over 1,580 creators earning money on Funroad.
						</h1>
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-base">Username</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Enter your username" />
									</FormControl>
									<FormDescription
										className={cn("hidden", showPreview && "block")}
									>
										{/* Todo use proper method to generate domain */}
										Your store will be available at <strong>{username}</strong>
										.shop.com
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-base">Email</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Enter your email"
											type="email"
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-base">Password</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Enter your password"
											type="password"
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							disabled={register.isPending}
							type="submit"
							size={"lg"}
							variant={"elevated"}
							className="bg-black text-white hover:bg-pink-400 hover:text-primary"
						>
							Create account
						</Button>
					</form>
				</Form>
			</div>
			<div
				className="h-screen w-full lg:col-span-2 hidden lg:block"
				style={{
					backgroundImage: "url('/auth-bg.png')",
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			/>
		</div>
	);
};
