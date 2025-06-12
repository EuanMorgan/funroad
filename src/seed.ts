import chalk from "chalk";
import ora from "ora";
import { getPayload } from "payload";
import configPromise from "./payload.config";

const categories = [
	{
		name: "All",
		slug: "all",
	},
	{
		name: "Business & Money",
		color: "#FFB347",
		slug: "business-money",
		subcategories: [
			{ name: "Accounting", slug: "accounting" },
			{
				name: "Entrepreneurship",
				slug: "entrepreneurship",
			},
			{ name: "Gigs & Side Projects", slug: "gigs-side-projects" },
			{ name: "Investing", slug: "investing" },
			{ name: "Management & Leadership", slug: "management-leadership" },
			{
				name: "Marketing & Sales",
				slug: "marketing-sales",
			},
			{ name: "Networking, Careers & Jobs", slug: "networking-careers-jobs" },
			{ name: "Personal Finance", slug: "personal-finance" },
			{ name: "Real Estate", slug: "real-estate" },
		],
	},
	{
		name: "Software Development",
		color: "#7EC8E3",
		slug: "software-development",
		subcategories: [
			{ name: "Web Development", slug: "web-development" },
			{ name: "Mobile Development", slug: "mobile-development" },
			{ name: "Game Development", slug: "game-development" },
			{ name: "Programming Languages", slug: "programming-languages" },
			{ name: "DevOps", slug: "devops" },
		],
	},
	{
		name: "Writing & Publishing",
		color: "#D8B5FF",
		slug: "writing-publishing",
		subcategories: [
			{ name: "Fiction", slug: "fiction" },
			{ name: "Non-Fiction", slug: "non-fiction" },
			{ name: "Blogging", slug: "blogging" },
			{ name: "Copywriting", slug: "copywriting" },
			{ name: "Self-Publishing", slug: "self-publishing" },
		],
	},
	{
		name: "Other",
		slug: "other",
	},
	{
		name: "Education",
		color: "#FFE066",
		slug: "education",
		subcategories: [
			{ name: "Online Courses", slug: "online-courses" },
			{ name: "Tutoring", slug: "tutoring" },
			{ name: "Test Preparation", slug: "test-preparation" },
			{ name: "Language Learning", slug: "language-learning" },
		],
	},
	{
		name: "Self Improvement",
		color: "#96E6B3",
		slug: "self-improvement",
		subcategories: [
			{ name: "Productivity", slug: "productivity" },
			{ name: "Personal Development", slug: "personal-development" },
			{ name: "Mindfulness", slug: "mindfulness" },
			{ name: "Career Growth", slug: "career-growth" },
		],
	},
	{
		name: "Fitness & Health",
		color: "#FF9AA2",
		slug: "fitness-health",
		subcategories: [
			{ name: "Workout Plans", slug: "workout-plans" },
			{ name: "Nutrition", slug: "nutrition" },
			{ name: "Mental Health", slug: "mental-health" },
			{ name: "Yoga", slug: "yoga" },
		],
	},
	{
		name: "Design",
		color: "#B5B9FF",
		slug: "design",
		subcategories: [
			{ name: "UI/UX", slug: "ui-ux" },
			{ name: "Graphic Design", slug: "graphic-design" },
			{ name: "3D Modeling", slug: "3d-modeling" },
			{ name: "Typography", slug: "typography" },
		],
	},
	{
		name: "Drawing & Painting",
		color: "#FFCAB0",
		slug: "drawing-painting",
		subcategories: [
			{ name: "Watercolor", slug: "watercolor" },
			{ name: "Acrylic", slug: "acrylic" },
			{ name: "Oil", slug: "oil" },
			{ name: "Pastel", slug: "pastel" },
			{ name: "Charcoal", slug: "charcoal" },
		],
	},
	{
		name: "Music",
		color: "#FFD700",
		slug: "music",
		subcategories: [
			{ name: "Songwriting", slug: "songwriting" },
			{ name: "Music Production", slug: "music-production" },
			{ name: "Music Theory", slug: "music-theory" },
			{ name: "Music History", slug: "music-history" },
		],
	},
	{
		name: "Photography",
		color: "#FF6B6B",
		slug: "photography",
		subcategories: [
			{ name: "Portrait", slug: "portrait" },
			{ name: "Landscape", slug: "landscape" },
			{ name: "Street Photography", slug: "street-photography" },
			{ name: "Nature", slug: "nature" },
			{ name: "Macro", slug: "macro" },
		],
	},
];

const seed = async () => {
	console.log(chalk.cyan.bold("\n🌱 Starting database seeding process...\n"));

	const mainSpinner = ora({
		text: "Initializing Payload CMS",
		color: "cyan",
	}).start();

	const payload = await getPayload({ config: configPromise });
	mainSpinner.succeed(chalk.green("Payload CMS initialized successfully"));

	// create admin user
	// Spinner for admin user
	const adminUserSpinner = ora({
		text: "Creating admin user",
		color: "yellow",
	}).start();

	const adminTenant = await payload.create({
		collection: "tenants",
		data: {
			name: "admin",
			slug: "admin",
			stripeAccountId: "test",
		},
	});

	await payload.create({
		collection: "users",
		data: {
			email: "admin@funroad.euanmorgan.uk",
			password: "demo",
			roles: ["super-admin"],
			username: "admin",
			tenants: [
				{
					tenant: adminTenant.id,
				},
			],
		},
	});
	adminUserSpinner.succeed(chalk.green("Admin user created successfully"));

	const totalCategories = categories.length;
	let completedCategories = 0;

	for (const category of categories) {
		const categorySpinner = ora({
			text: `Creating category: ${chalk.yellow(category.name)}`,
			color: "yellow",
		}).start();

		try {
			const parent = await payload.create({
				collection: "categories",
				data: {
					name: category.name,
					slug: category.slug,
					color: category.color,
					parent: null,
				},
			});

			if (category.subcategories?.length) {
				categorySpinner.text = `Creating ${chalk.cyan(category.subcategories.length)} subcategories for ${chalk.yellow(category.name)}`;

				for (const sub of category.subcategories) {
					await payload.create({
						collection: "categories",
						data: {
							name: sub.name,
							slug: sub.slug,
							parent: parent.id,
						},
					});
				}
			}

			completedCategories++;
			categorySpinner.succeed(
				chalk.green(
					`Created category ${chalk.yellow(category.name)} ${
						category.subcategories?.length
							? chalk.gray(
									`with ${category.subcategories.length} subcategories`,
								)
							: ""
					} (${completedCategories}/${totalCategories})`,
				),
			);
		} catch (error) {
			categorySpinner.fail(
				chalk.red(`Failed to create category ${chalk.yellow(category.name)}`),
			);
			throw error;
		}
	}
};

try {
	await seed();
	console.log(
		chalk.green.bold("\n✨ Database seeding completed successfully!\n"),
	);
} catch (error) {
	console.error(chalk.red.bold("\n❌ Seeding failed:"));
	console.error(
		chalk.red(error instanceof Error ? error.message : String(error)),
	);
	process.exit(1);
}

process.exit(0);
