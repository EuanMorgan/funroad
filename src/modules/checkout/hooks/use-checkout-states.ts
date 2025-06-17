import { parseAsBoolean, useQueryStates } from "nuqs";

export const useCheckoutStates = () => {
	return useQueryStates({
		success: parseAsBoolean
			.withOptions({
				clearOnDefault: true,
			})
			.withDefault(false),
		cancel: parseAsBoolean
			.withOptions({
				clearOnDefault: true,
			})
			.withDefault(false),
	});
};
