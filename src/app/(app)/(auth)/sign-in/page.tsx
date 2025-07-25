export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { SignInView } from "~/modules/auth/ui/views/sign-in-view";
import { caller } from "~/trpc/server";

export default async function Page() {
	const session = await caller.auth.session();

	if (session.user) {
		redirect("/");
	}

	return <SignInView />;
}
