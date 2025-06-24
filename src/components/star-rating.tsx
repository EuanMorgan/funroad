import { StarIcon } from "lucide-react";
import { cn } from "~/lib/utils";

const MAX_RATING = 5;
const MIN_RATING = 0;

interface StarRatingProps {
	rating: number;
	className?: string;
	iconClassName?: string;
	text?: string;
}

export const StarRating = ({
	rating,
	className,
	iconClassName,
	text,
}: StarRatingProps) => {
	const clampedRating = Math.max(MIN_RATING, Math.min(MAX_RATING, rating));

	return (
		<div className={cn("flex items-center gap-x-1", className)}>
			{Array.from({ length: MAX_RATING }).map((_, index) => (
				<StarIcon
					// biome-ignore lint/suspicious/noArrayIndexKey: ignore
					key={index}
					className={cn(
						"size-4",
						index < clampedRating ? "fill-black" : "",
						iconClassName,
					)}
				/>
			))}
			{text && <p>{text}</p>}
		</div>
	);
};
