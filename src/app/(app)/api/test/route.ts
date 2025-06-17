import { NextResponse } from "next/server";
import { env } from "~/env";

export function GET() {
	return NextResponse.json({ env });
}
