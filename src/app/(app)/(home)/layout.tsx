import configPromise from "@payload-config";
import { getPayload } from "payload";
import { Footer } from "~/app/(app)/(home)/footer";
import { Navbar } from "~/app/(app)/(home)/navbar";
import { SearchFilters } from "~/app/(app)/(home)/search-filters";
export default async function HomeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const payload = await getPayload({
		config: configPromise,
	});

	const data = await payload.find({
		collection: "categories",
		depth: 1, // Populate subcategories
		where: {
			parent: {
				exists: false,
			},
		},
	});

	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />
			<SearchFilters data={data} />
			<div className="flex-1 bg-[#F4F4F0]">{children}</div>
			<Footer />
		</div>
	);
}
