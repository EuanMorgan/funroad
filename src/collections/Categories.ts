import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  auth: true,
  fields: [
    {
      name: "name",
      type: "text",
      required: true
    }
  ],
}
