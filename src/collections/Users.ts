import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields";
import type { CollectionConfig } from "payload";

const defaultTenantArrayField = tenantsArrayField({
	tenantsArrayFieldName: "tenants",
	tenantsCollectionSlug: "tenants",
	tenantsArrayTenantFieldName: "tenant",
	// TODO: Add access control
	arrayFieldAccess: {
		read: () => true,
		create: () => true,
		update: () => true,
	},
	tenantFieldAccess: {
		read: () => true,
		create: () => true,
		update: () => true,
	},
});
export const Users: CollectionConfig = {
	slug: "users",
	admin: {
		useAsTitle: "email",
	},
	auth: true,
	fields: [
		// Email added by default
		{
			name: "username",
			required: true,
			unique: true,
			type: "text",
		},
		{
			admin: {
				position: "sidebar",
			},
			name: "roles",
			type: "select",
			defaultValue: ["user"],
			hasMany: true,
			options: ["user", "super-admin"],
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
