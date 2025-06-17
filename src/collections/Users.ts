import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields";
import type { CollectionConfig } from "payload";
import { env } from "~/env";
import { isSuperAdmin } from "~/lib/access";

const defaultTenantArrayField = tenantsArrayField({
	tenantsArrayFieldName: "tenants",
	tenantsCollectionSlug: "tenants",
	tenantsArrayTenantFieldName: "tenant",
	arrayFieldAccess: {
		read: () => true,
		create: ({ req }) => isSuperAdmin(req.user),
		update: ({ req }) => isSuperAdmin(req.user),
	},
	tenantFieldAccess: {
		read: () => true,
		create: ({ req }) => isSuperAdmin(req.user),
		update: ({ req }) => isSuperAdmin(req.user),
	},
});
export const Users: CollectionConfig = {
	slug: "users",
	admin: {
		useAsTitle: "email",
		hidden: ({ user }) => !isSuperAdmin(user),
	},
	access: {
		read: () => true,
		create: ({ req }) => isSuperAdmin(req.user),
		update: ({ req }) => isSuperAdmin(req.user),
		delete: ({ req, id }) => {
			if (isSuperAdmin(req.user)) {
				return true;
			}

			return req.user?.id === id;
		},
	},
	auth: {
		cookies: {
			...(process.env.NODE_ENV !== "development" && {
				secure: true,
				sameSite: "None",
				domain: env.NEXT_PUBLIC_ROOT_DOMAIN,
			}),
		},
	},
	fields: [
		// Email added by default
		{
			name: "username",
			required: true,
			unique: true,
			type: "text",
		},
		{
			name: "roles",
			type: "select",
			defaultValue: ["user"],
			admin: {
				position: "sidebar",
			},
			hasMany: true,
			options: ["user", "super-admin"],
			access: {
				update: ({ req }) => isSuperAdmin(req.user),
			},
		},
		{
			...defaultTenantArrayField,
			admin: {
				...defaultTenantArrayField.admin,
				position: "sidebar",
			},
		},
	],
};
