"use client";

import { RichText } from "@payloadcms/richtext-lexical/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Check, LinkIcon, StarIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { StarRating } from "~/components/star-rating";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { formatCurrency, generateTenantURL } from "~/lib/utils";

// Cart Button uses local storage, so we can dynamically import it without SSR to avoid hydration errors
const CartButton = dynamic(
	() =>
		import("~/modules/products/ui/components/cart-button").then(
			(mod) => mod.CartButton,
		),
	{
		ssr: false,
		loading: () => (
			<Button disabled className="flex-1 bg-pink-400">
				Add to cart
			</Button>
		),
	},
);

import { useTRPC } from "~/trpc/client";

interface ProductViewProps {
	productId: string;
	tenantSlug: string;
}

export const ProductView = ({ productId, tenantSlug }: ProductViewProps) => {
	const trpc = useTRPC();

	const { data } = useSuspenseQuery(
		trpc.products.getOne.queryOptions({
			id: productId,
		}),
	);

	const [isCopied, setIsCopied] = useState(false);

	return (
		<div className="px-4 lg:px-12 py-10">
			<div className="border rounded-sm bg-white overflow-hidden">
				<div className="relative aspect-[3.9] border-b">
					<Image
						src={data.image?.url || "/placeholder.png"}
						alt={data.name}
						fill
						className="object-cover"
					/>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-6">
					<div className="col-span-4">
						<div className="p-6">
							<h1 className="text-4xl font-medium">{data.name}</h1>
						</div>
						<div className="border-y flex">
							<div className="px-6 py-4 flex items-center justify-center border-r">
								<div className="px-2 py-1 border bg-pink-400 w-fit">
									<p className="text-base font-medium">
										{formatCurrency(data.price)}
									</p>
								</div>
							</div>
							<div className="px-6 py-4 flex items-center justify-center lg:border-r">
								<Link
									href={generateTenantURL(tenantSlug)}
									className="flex items-center gap-2"
								>
									{data.tenant.image?.url && (
										<Image
											src={data.tenant.image.url}
											alt={data.tenant.name}
											width={20}
											height={20}
											className="rounded-full border shrink-0 size-[20px]"
										/>
									)}
									<p className="text-base underline font-medium">
										{data.tenant.name}
									</p>
								</Link>
							</div>
							<div className="hidden lg:flex px-6 py-4 items-center justify-center">
								<div className="flex items-center gap-2">
									<StarRating rating={data.reviewRating} />
									<p className="text-base font-medium">
										{data.reviewCount}{" "}
										{data.reviewCount === 1 ? "rating" : "ratings"}
									</p>
								</div>
							</div>
						</div>

						{/* Mobile only  */}

						<div className="block lg:hidden px-6 py-4 items-center justify-center border-b">
							<div className="flex items-center gap-2">
								<StarRating rating={data.reviewRating} />
								<p className="text-base font-medium">
									{data.reviewCount}{" "}
									{data.reviewCount === 1 ? "rating" : "ratings"}
								</p>
							</div>
						</div>

						<div className="p-6">
							{data.description ? (
								<RichText data={data.description} />
							) : (
								<p className="font-medium text-muted-foreground italic">
									No description available
								</p>
							)}
						</div>
					</div>

					<div className="col-span-2">
						<div className="border-t lg:border-t-0 lg:border-l h-full">
							<div className="flex flex-col gap-4 p-6 border-b">
								<div className="flex flex-row items-center gap-2">
									<CartButton
										isPurchased={data.isPurchased}
										productId={productId}
										tenantSlug={tenantSlug}
									/>

									<Button
										className="size-12"
										variant={"elevated"}
										onClick={() => {
											setIsCopied(true);
											navigator.clipboard.writeText(window.location.href);
											toast.success("Link copied to clipboard");

											setTimeout(() => {
												setIsCopied(false);
											}, 2000);
										}}
										disabled={isCopied}
									>
										{isCopied ? <Check /> : <LinkIcon />}
										<span className="sr-only">
											{isCopied ? "Link copied to clipboard" : "Copy link"}
										</span>
									</Button>
								</div>
								<p className="text-center font-medium">
									{data.refundPolicy === "no-refunds"
										? "No Refunds"
										: `${data.refundPolicy} money back guarantee`}
								</p>
							</div>
							<div className="p-6">
								<div className="flex items-center justify-between">
									<h3 className="text-xl font-medium">Ratings</h3>
									<div className="flex items-center gap-x-1 font-medium">
										<StarIcon className="size-4 fill-black" />
										<p>({data.reviewRating})</p>

										<p className="text-base">
											{data.reviewCount}{" "}
											{data.reviewCount === 1 ? "rating" : "ratings"}
										</p>
									</div>
								</div>

								<div className="grid grid-cols-[auto_1fr_auto] gap-3 mt-4">
									{[5, 4, 3, 2, 1].map((stars) => (
										<Fragment key={stars}>
											<p className="font-medium">
												{stars} {stars === 1 ? "star" : "stars"}
											</p>
											<Progress
												value={data.ratingDistribution[stars] ?? 0}
												className="h-[1lh]"
											/>
											<div className="font-medium">
												{data.ratingDistribution[stars] ?? 0}%
											</div>
										</Fragment>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export const ProductViewSkeleton = () => {
	return (
		<div className="px-4 lg:px-12 py-10">
			<div className="border rounded-sm bg-white overflow-hidden">
				<div className="relative aspect-[3.9] border-b">
					<Image
						src={"/placeholder.png"}
						alt={"Loading..."}
						fill
						className="object-cover"
					/>
				</div>
			</div>
		</div>
	);
};
