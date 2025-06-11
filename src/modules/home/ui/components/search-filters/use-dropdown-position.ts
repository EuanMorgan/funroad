import type { RefObject } from "react";

export const useDropdownPosition = (
	ref: RefObject<HTMLElement | null> | RefObject<HTMLDivElement>,
) => {
	const getDropdownPosition = () => {
		if (!ref.current) return { top: 0, left: 0 };

		const rect = ref.current.getBoundingClientRect();

		const dropdownWidth = 240; // Width (w-60 = 15rem = 240px)

		// Calc initial position

		let left = rect.left + window.scrollX;
		const top = rect.bottom + window.scrollY;

		// Check if the dropdown is overflowing on the right
		if (left + dropdownWidth > window.innerWidth) {
			// Align to right edge of button instead
			left = rect.right + window.scrollX - dropdownWidth;
		}

		// If still off-screen, align to right edge of viewport with some padding

		if (left < 0) {
			left = window.innerWidth - dropdownWidth - 16;
		}

		// Ensure dropdown doesn't go off left edge
		if (left < 0) {
			left = 16;
		}

		return { top, left };
	};

	return { getDropdownPosition };
};
