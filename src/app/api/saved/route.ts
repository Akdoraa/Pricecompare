import { NextResponse } from "next/server";
import { getSavedDeals } from "@/lib/server/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json(
      { error: "sessionId is required" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    deals: getSavedDeals(sessionId),
  });
}
