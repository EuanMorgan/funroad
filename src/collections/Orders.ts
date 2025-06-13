import type { CollectionConfig } from "payload";

export const Orders: CollectionConfig = {
	slug: "orders",
	fields: [
		{
			name: "name",
			type: "text",
			required: true,
		},
		{
			name: "user",
			type: "relationship",
			relationTo: "users",
			required: true,
			hasMany: false,
		},
		{
			name: "product",
			type: "relationship",
			relationTo: "users",
			required: true,
			hasMany: false,
		},
		{
			name: "stripeCheckoutSessionId",
			type: "text",
			required: true,
		},
	],
};
