"use client";

import { StarIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "~/lib/utils";

interface StarPickerProps {
	value?: number;
	onChange?: (value: number) => void;
	disabled?: boolean;
	className?: string;
}

export const StarPicker = ({
	value,
	onChange,
	disabled,
	className,
}: StarPickerProps) => {
	const [hoverValue, setHoverValue] = useState(0);

	return (
		<div
			className={cn(
				"flex items-center",
				disabled && "opacity-50 cursor-not-allowed pointer-events-none",
				className,
			)}
		>
			{[1, 2, 3, 4, 5].map((star) => (
				<button
					aria-label={`${star} star${star > 1 ? "s" : ""}`}
					aria-pressed={(value ?? 0) >= star}
					disabled={disabled}
					key={star}
					type="button"
					onClick={() => onChange?.(star)}
					onMouseEnter={() => setHoverValue(star)}
					onMouseLeave={() => setHoverValue(0)}
					className={cn(
						"p-0.5 hover:scale-110 transition",
						!disabled && "cursor-pointer",
					)}
				>
					<StarIcon
						className={cn(
							"size-5",
							(hoverValue || value || 0) >= star
								? "fill-black stroke-black"
								: "stroke-black",
						)}
					/>
				</button>
			))}
		</div>
	);
};
