interface Props {
	params: Promise<{
		category: string;
		subcategory: string;
	}>;
}

export default async function CategoryPage({ params }: Props) {
	const { category, subcategory } = await params;

	return (
		<div>
			<h1>Category: {category}</h1>
			<h1>Subcategory: {subcategory}</h1>
		</div>
	);
}
