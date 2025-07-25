import { Poppins } from "next/font/google";
import Link from "next/link";
import { env } from "~/env";
import { cn } from "~/lib/utils";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["700"],
});

export const Footer = () => {
	return (
		<footer className="border-t font-medium bg-white">
			<div className="max-w-(--breakpoint-xl) mx-auto flex items-center gap-2 h-full px-4 lg:px-12 py-6">
				<p>Powered by</p>
				<Link href={env.NEXT_PUBLIC_BASE_URL}>
					<span className={cn(poppins.className, "text-2xl font-semibold")}>
						funroad
					</span>
				</Link>
			</div>
		</footer>
	);
};
