import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/client";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "~/components/ui/sonner";

const dmSans = DM_Sans({
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "funroad",
	description: "Sell your soul and your trampoline",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${dmSans.className} antialiased`}>
				<NuqsAdapter>
					<TRPCReactProvider>
						{children}
						<ReactQueryDevtools />
						<Toaster />
					</TRPCReactProvider>
				</NuqsAdapter>
			</body>
		</html>
	);
}
