"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ShoppingCartIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { generateTenantURL } from "~/lib/utils";

const CheckoutButton = dynamic(
	() =>
		import("~/modules/checkout/ui/components/checkout-button").then(
			(mod) => mod.CheckoutButton,
		),
	{
		ssr: false,
		loading: () => (
			<Button disabled className="bg-white">
				<ShoppingCartIcon className="text-black" />
			</Button>
		),
	},
);

import { useTRPC } from "~/trpc/client";

interface Props {
	slug: string;
}

export const Navbar = ({ slug }: Props) => {
	const trpc = useTRPC();

	const { data: tenant } = useSuspenseQuery(
		trpc.tenants.getone.queryOptions({
			slug,
		}),
	);

	return (
		<nav className="h-20 border-b font-medium bg-white">
			<div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12">
				<Link
					href={generateTenantURL(slug)}
					className="flex items-center gap-2"
				>
					{tenant.image?.url && (
						<Image
							src={tenant.image.url}
							alt={tenant.name}
							width={32}
							height={32}
							className="rounded-full border shrink-0 size-[32px]"
						/>
					)}
					<p className="text-xl">{tenant.name}</p>
				</Link>
				<CheckoutButton tenantSlug={slug} hideIfEmpty />
			</div>
		</nav>
	);
};

export const NavbarSkeleton = () => {
	return (
		<nav className="h-20 border-b font-medium bg-white">
			<div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12">
				<div />

				<Button disabled className="bg-white">
					<ShoppingCartIcon className="text-black" />
				</Button>
			</div>
		</nav>
	);
};
