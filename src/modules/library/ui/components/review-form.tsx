import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { StarPicker } from "~/components/star-picker";
import { Button } from "~/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	useForm,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import {
	type CreateReviewSchema,
	createReviewSchema,
} from "~/modules/library/schemas";
import type { RouterOutputs } from "~/trpc";
import { useTRPC } from "~/trpc/client";

interface ReviewFormProps {
	productId: string;
	initialData?: RouterOutputs["reviews"]["getOne"];
}

export const ReviewForm = ({ productId, initialData }: ReviewFormProps) => {
	const [isPreview, setIsPreview] = useState(!!initialData);

	const trpc = useTRPC();

	const queryClient = useQueryClient();

	const form = useForm({
		schema: createReviewSchema,
		defaultValues: {
			rating: initialData?.rating ?? 0,
			description: initialData?.description ?? "",
		},
	});

	const createReview = useMutation(
		trpc.reviews.create.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries(
					trpc.reviews.getOne.queryFilter({ productId }),
				);
				setIsPreview(true);
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

	const updateReview = useMutation(
		trpc.reviews.update.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries(
					trpc.reviews.getOne.queryFilter({ productId }),
				);
				setIsPreview(true);
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

	const onSubmit = (data: CreateReviewSchema) => {
		if (initialData) {
			updateReview.mutate({
				reviewId: initialData.id,
				...data,
			});
		} else {
			createReview.mutate({
				productId,
				...data,
			});
		}
	};

	return (
		<Form {...form}>
			<form
				className="flex flex-col gap-y-4"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<p className="font-medium">
					{isPreview ? "Your rating" : "Liked it? Give it a rating"}
				</p>
				<FormField
					control={form.control}
					name="rating"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<StarPicker
									value={field.value}
									onChange={field.onChange}
									disabled={isPreview}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Textarea
									{...field}
									placeholder="Want to share your thoughts?"
									disabled={isPreview}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{!isPreview && (
					<Button
						type="submit"
						disabled={createReview.isPending || updateReview.isPending}
						variant="elevated"
						className="w-fit bg-black text-white hover:bg-pink-400 hover:text-primary"
						size="lg"
					>
						{initialData ? "Update Review" : "Post Review"}
					</Button>
				)}
			</form>
			{isPreview && (
				<Button
					disabled={createReview.isPending || updateReview.isPending}
					type="button"
					onClick={() => setIsPreview(false)}
					size="lg"
					variant={"elevated"}
					className="w-fit mt-4"
				>
					Edit
				</Button>
			)}
		</Form>
	);
};
