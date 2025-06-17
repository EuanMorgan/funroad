import type { CollectionConfig } from "payload";
import { isSuperAdmin } from "~/lib/access";

export const Tenants: CollectionConfig = {
	slug: "tenants",
	access: {
		create: ({ req }) => isSuperAdmin(req.user),
		delete: ({ req }) => isSuperAdmin(req.user),
	},
	admin: {
		useAsTitle: "slug",
	},
	fields: [
		{
			name: "name",
			required: true,
			type: "text",
			label: "Store Name",
			admin: {
				description: "The name of the store (e.g. Tom's Trampolines)",
			},
		},
		{
			name: "slug",
			type: "text",
			index: true,
			required: true,
			access: {
				update: ({ req }) => isSuperAdmin(req.user),
			},
			unique: true,
			admin: {
				description:
					"This is the subdomain for the store (e.g. [slug].funroad.euanmorgan.uk)",
			},
		},
		{
			name: "image",
			type: "upload",
			relationTo: "media",
		},
		{
			name: "stripeAccountId",
			type: "text",
			required: true,
			access: {
				update: ({ req }) => isSuperAdmin(req.user),
			},
			admin: {
				description: "Stripe account ID associated with your shop",
			},
		},
		{
			name: "stripeDetailsSubmitted",
			type: "checkbox",
			access: {
				update: ({ req }) => isSuperAdmin(req.user),
			},
			admin: {
				description:
					"You cannot create products until you submit your Stripe details",
			},
		},
	],
};
