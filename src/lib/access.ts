import type { ClientUser } from "payload";
import type { User } from "~/payload-types";

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
