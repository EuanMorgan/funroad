import { Footer } from "~/app/(app)/(home)/footer";
import { Navbar } from "~/app/(app)/(home)/navbar";

export default function HomeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />
			<div className="flex-1 bg-[#F4F4F0]">{children}</div>
			<Footer />
		</div>
	);
}
