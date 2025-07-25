"use client";

import { useQuery } from "@tanstack/react-query";
import { MenuIcon } from "lucide-react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { NavbarSidebar } from "~/modules/home/ui/components/navbar-sidebar";
import { useTRPC } from "~/trpc/client";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["700"],
});

interface NavbarItemProps {
	children: React.ReactNode;
	href: string;
	isActive?: boolean;
}

const NavbarItem = ({ children, href, isActive }: NavbarItemProps) => {
	return (
		<Button
			asChild
			variant={"outline"}
			className={cn(
				"bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-3.5 text-lg",
				isActive && "bg-black text-white hover:bg-black hover:text-white",
			)}
		>
			<Link href={href}>{children}</Link>
		</Button>
	);
};

const navbarItems = [
	{
		href: "/",
		children: "Home",
	},
	{
		href: "/about",
		children: "About",
	},
	{
		href: "/features",
		children: "Features",
	},
	{
		href: "/pricing",
		children: "Pricing",
	},
	{
		href: "/contact",
		children: "Contact",
	},
];

export const Navbar = () => {
	const pathname = usePathname();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const trpc = useTRPC();
	const session = useQuery(trpc.auth.session.queryOptions());

	const isLoggedIn = !!session.data?.user;

	return (
		<nav className="h-20 flex border-b justify-between font-medium bg-white">
			<Link href="/" className="pl-6 flex items-center">
				<span className={cn(poppins.className, "text-5xl font-semibold")}>
					funroad
				</span>
			</Link>

			<NavbarSidebar
				items={navbarItems}
				open={isSidebarOpen}
				onOpenChange={setIsSidebarOpen}
			/>

			<div className="hidden lg:flex items-center gap-x-4">
				{navbarItems.map((item) => (
					<NavbarItem
						key={item.href}
						href={item.href}
						isActive={pathname === item.href}
					>
						{item.children}
					</NavbarItem>
				))}
			</div>

			{isLoggedIn ? (
				<div className="hidden lg:flex">
					<Button
						asChild
						variant={"secondary"}
						className="border-l border-t-0 border-b-0 border-r-0 rounded-none px-12 h-full bg-black text-white hover:text-black hover:bg-pink-400 transition-colors text-lg"
					>
						<Link href="/admin">Dashboard</Link>
					</Button>
				</div>
			) : (
				<div className="hidden lg:flex">
					<Button
						asChild
						variant={"secondary"}
						className="border-l border-t-0 border-b-0 border-r-0 rounded-none px-12 h-full bg-white hover:bg-pink-400 transition-colors text-lg"
					>
						<Link prefetch href="/sign-in">
							Login
						</Link>
					</Button>

					<Button
						asChild
						variant={"secondary"}
						className="border-l border-t-0 border-b-0 border-r-0 rounded-none px-12 h-full bg-black text-white hover:text-black hover:bg-pink-400 transition-colors text-lg"
					>
						<Link prefetch href="/sign-up">
							Start Selling
						</Link>
					</Button>
				</div>
			)}

			<div className="flex lg:hidden items-center justify-center">
				<Button
					variant={"ghost"}
					className="size-12 border-transparent bg-white"
					onClick={() => setIsSidebarOpen(true)}
				>
					<MenuIcon />
				</Button>
			</div>
		</nav>
	);
};
