import path from "node:path";
import { fileURLToPath } from "node:url";
// storage-adapter-import-placeholder
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { multiTenantPlugin } from "@payloadcms/plugin-multi-tenant";
import { buildConfig } from "payload";
import sharp from "sharp";

// Import all Collections to use below
import { Categories } from "./collections/Categories";
import { Media } from "./collections/Media";
import { Users } from "./collections/Users";
import { Products } from "./collections/Products";
import { Tags } from "./collections/Tags";
import { Tenants } from "./collections/Tenants";
import { Orders } from "./collections/Orders";
import { Config } from "~/payload-types";
import { env } from "~/env";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
	admin: {
		user: Users.slug,
		importMap: {
			baseDir: path.resolve(dirname),
		},
	},
	collections: [Users, Media, Categories, Products, Tags, Tenants, Orders],
	editor: lexicalEditor(),
	secret: env.PAYLOAD_SECRET,
	typescript: {
		outputFile: path.resolve(dirname, "payload-types.ts"),
	},
	db: mongooseAdapter({
		url: env.DATABASE_URI,
	}),
	cookiePrefix: "funroad",
	sharp,
	plugins: [
		payloadCloudPlugin(),
		multiTenantPlugin<Config>({
			collections:{
				products:{}
			},
			tenantsArrayField:{
				includeDefaultField:false
			},
			userHasAccessToAllTenants:user => Boolean(user?.roles?.includes("super-admin"))
		}),
		// storage-adapter-placeholder
	],
});
