import type { CollectionConfig } from "payload";
import { isSuperAdmin } from "~/lib/access";
import type { Tenant } from "~/payload-types";

export const Products: CollectionConfig = {
	slug: "products",
	access: {
		create: ({ req }) => {
			if (isSuperAdmin(req.user)) {
				return true;
			}

			// Tenants must have submitted stripe details to create products
			const tenant = req.user?.tenants?.[0]?.tenant as Tenant;

			return Boolean(tenant?.stripeDetailsSubmitted);
		},
		delete: ({ req }) => isSuperAdmin(req.user),
	},
	admin: {
		useAsTitle: "name",
		description: "You must verify your account before creating products",
	},
	fields: [
		{
			name: "name",
			type: "text",
			required: true,
		},
		{
			// TODO: Change to rich text
			name: "description",
			type: "text",
		},
		{
			name: "price",
			type: "number",
			required: true,
			admin: {
				description: "in GBP",
			},
		},
		{
			name: "category",
			type: "relationship",
			relationTo: "categories",
			hasMany: false,
		},
		{
			name: "tags",
			type: "relationship",
			relationTo: "tags",
			hasMany: true,
		},
		{
			name: "image",
			type: "upload",
			relationTo: "media",
			hasMany: true,
		},
		{
			name: "refundPolicy",
			type: "select",
			options: ["30-day", "14-day", "7-day", "3-day", "1-day", "no-refunds"],
			defaultValue: "30-day",
		},
		{
			name: "content",
			// TODO: Change to rich text
			type: "textarea",
			admin: {
				description:
					"Protected content only visible to customers after purchase. Add product documentation, downloadable files, getting started guides, and bonus materials. Supports markdown formatting.",
			},
		},
		{
			name: "isArchived",
			label: "Archive",
			defaultValue: false,
			type: "checkbox",
			admin: {
				description:
					"Archived products are not able to be seen on the store or purchased",
			},
		},
		{
			name: "isPrivate",
			label: "Private",
			defaultValue: false,
			type: "checkbox",
			admin: {
				description:
					"Private products are not visible on the public funroad storefront, only your storefront",
			},
		},
	],
};
