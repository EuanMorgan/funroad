import type { CollectionConfig } from "payload";
import { isSuperAdmin } from "~/lib/access";

export const Media: CollectionConfig = {
	slug: "media",
	access: {
		read: () => true,
		delete: ({ req }) => isSuperAdmin(req.user),
	},
	admin: {
		// No need to show media collection to non-super admins, it's just confusing for them
		hidden: ({ user }) => !isSuperAdmin(user),
	},
	fields: [
		{
			name: "alt",
			type: "text",
			required: true,
		},
	],
	upload: true,
};
