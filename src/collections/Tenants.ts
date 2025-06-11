import type { CollectionConfig } from "payload";

export const Tenants: CollectionConfig = {
	slug: "tenants",
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
			admin: {
				readOnly: true,
			},
		},
		{
			name: "stripeDetailsSubmitted",
			type: "checkbox",
			admin: {
				readOnly: true,
				description:
					"You cannot create products until you submit your Stripe details",
			},
		},
	],
};
