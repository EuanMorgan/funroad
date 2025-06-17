import type Stripe from "stripe";

import config from "@payload-config";
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import { env } from "~/env";
import { stripe } from "~/lib/stripe";
import type { ExpandedLineItem } from "~/modules/checkout/types";

export async function POST(request: Request) {
	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(
			await (await request.blob()).text(),
			request.headers.get("stripe-signature") as string,
			env.STRIPE_WEBHOOK_SECRET,
		);
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown Error";
		console.error(`❌ Webhook Error: ${errorMessage}`);
		return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
	}

	console.log("🔔 Webhook received:", event.type);

	const permittedEvents = [
		"checkout.session.completed",
		"account.updated",
	] as const satisfies Stripe.Event.Type[];

	const payload = await getPayload({
		config,
	});

	// biome-ignore lint/suspicious/noExplicitAny: Allow running includes against our narrow as const type
	if (!permittedEvents.includes(event.type as any)) {
		return NextResponse.json(
			{
				error: "Unauthorized event",
			},
			{ status: 401 },
		);
	}

	// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
	let data;

	try {
		switch (event.type as (typeof permittedEvents)[number]) {
			case "checkout.session.completed": {
				data = event.data.object as Stripe.Checkout.Session;
				if (!data.metadata?.userId) {
					throw new Error("User ID is required");
				}

				const user = await payload.findByID({
					collection: "users",
					id: data.metadata.userId,
				});

				if (!user) {
					throw new Error("User not found");
				}

				const expandedSession = await stripe.checkout.sessions.retrieve(
					data.id,
					{
						expand: ["line_items.data.price.product"],
					},
					{
						stripeAccount: event.account,
					},
				);

				const lineItems = expandedSession.line_items
					?.data as ExpandedLineItem[];
				if (!lineItems || !lineItems.length) {
					throw new Error("No line items found");
				}

				for (const item of lineItems) {
					await payload.create({
						collection: "orders",
						data: {
							stripeCheckoutSessionId: data.id,
							user: user.id,
							product: item.price.product.metadata.id,
							name: item.price.product.name,
							stripeAccountId: event.account,
						},
					});
				}

				break;
			}
			case "account.updated": {
				data = event.data.object as Stripe.Account;

				await payload.update({
					collection: "tenants",
					where: {
						stripeAccountId: { equals: data.id },
					},
					data: {
						stripeDetailsSubmitted: data.details_submitted,
					},
				});

				break;
			}
			default: {
				throw new Error(`Unhandled event type: ${event.type}`);
			}
		}
	} catch (error) {
		console.error("❌ Error processing event:", error);
		return NextResponse.json(
			{ error: "Webhook processing failed" },
			{ status: 500 },
		);
	}

	return NextResponse.json({ message: "Event processed successfully" });
}
