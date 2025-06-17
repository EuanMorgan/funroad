import { InboxIcon } from "lucide-react";

export const EmptyState = ({
	message,
	icon = <InboxIcon />,
}: {
	message: string;
	icon?: React.ReactNode;
}) => {
	return (
		<div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
			{icon}
			<p className="text-base font-medium">{message}</p>
		</div>
	);
};
