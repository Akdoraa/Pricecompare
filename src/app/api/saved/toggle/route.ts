import { NextResponse } from "next/server";
import { getSavedDeals, toggleSavedDeal } from "@/lib/server/store";

interface TogglePayload {
  sessionId?: string;
  productId?: string;
}

export async function POST(request: Request) {
  const payload = (await request.json()) as TogglePayload;
  if (!payload.sessionId || !payload.productId) {
    return NextResponse.json(
      { error: "sessionId and productId are required" },
      { status: 400 },
    );
  }

  const result = toggleSavedDeal(payload.sessionId, payload.productId);
  return NextResponse.json({
    ...result,
    deals: getSavedDeals(payload.sessionId),
  });
}
