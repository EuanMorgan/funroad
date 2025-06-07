import type { ChangeEvent } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface PriceFilterProps {
	minPrice: string | null;
	maxPrice: string | null;
	onMinPriceChange: (value: string) => void;
	onMaxPriceChange: (value: string) => void;
}

export const formatAsCurrency = (value: string) => {
	const numericValue = value.replace(/[^0-9.]/g, "");
	const parts = numericValue.split(".");
	// Rebuild the value with only 2 decimal places
	const formattedValue =
		parts[0] + (parts.length > 1 ? `.${parts[1]?.slice(0, 2)}` : "");

	if (!formattedValue) return "";

	const floatValue = Number.parseFloat(formattedValue);
	if (Number.isNaN(floatValue)) return "";

	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "GBP",
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(Number(value));
};

export const PriceFilter = ({
	minPrice,
	maxPrice,
	onMinPriceChange,
	onMaxPriceChange,
}: PriceFilterProps) => {
	const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
		// Remove all non-numeric and non-decimal characters
		const numericValue = e.target.value.replace(/[^0-9.]/g, "");
		onMinPriceChange(numericValue);
	};

	const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
		// Remove all non-numeric and non-decimal characters
		const numericValue = e.target.value.replace(/[^0-9.]/g, "");
		onMaxPriceChange(numericValue);
	};

	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-col gap-2">
				<Label htmlFor="min-price" className="font-medium text-base">
					Minimum Price
				</Label>
				<Input
					id="min-price"
					type="text"
					placeholder="£0"
					value={minPrice ? formatAsCurrency(minPrice) : ""}
					onChange={handleMinPriceChange}
				/>
			</div>
			<div className="flex flex-col gap-2">
				<Label htmlFor="max-price" className="font-medium text-base">
					Maximum Price {maxPrice} hello
				</Label>
				<Input
					id="max-price"
					type="text"
					placeholder="£∞"
					value={maxPrice ? formatAsCurrency(maxPrice) : ""}
					onChange={handleMaxPriceChange}
				/>
			</div>
		</div>
	);
};
