import type { User } from "~/payload-types";

import type { ClientUser } from "payload";

export const isSuperAdmin = (user: User | ClientUser | null) => {
	return user?.roles?.includes("super-admin");
};

const isAdmin = (user: User | ClientUser | null) => {
	return user?.roles?.includes("admin");
};

const isUser = (user: User | ClientUser | null) => {
	return user?.roles?.includes("user");
};

export const access = {
	isSuperAdmin,
	isAdmin,
	isUser,
};
