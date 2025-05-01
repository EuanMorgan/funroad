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
		pagination: false,
		where: {
			parent: {
				exists: false,
			},
		},
	});

	const formattedData = data.docs.map((doc) => ({
		...doc,
		subcategories: (doc.subcategories?.docs ?? []).map((sub) => ({
			//@ts-expect-error - Because of depth:1 we are confident doc will be a type of "Category", this will be removed when Payload fixes the type issue
			...sub,
			subcategories: undefined,
		})),
	}));

	console.log(formattedData);

	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />
			<SearchFilters data={formattedData} />
			<div className="flex-1 bg-[#F4F4F0]">{children}</div>
			<Footer />
		</div>
	);
}
