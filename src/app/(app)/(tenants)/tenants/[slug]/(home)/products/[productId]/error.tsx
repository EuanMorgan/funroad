"use client";

import { TriangleAlertIcon } from "lucide-react";
import { EmptyState } from "~/components/empty-state";

export default function ProductError() {
	return (
		<div className="px-4 lg:px-12 py-10">
			<EmptyState message="Something went wrong" icon={<TriangleAlertIcon />} />
		</div>
	);
}
