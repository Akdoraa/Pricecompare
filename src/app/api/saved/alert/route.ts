import { NextResponse } from "next/server";
import { getSavedDeals, updateSavedDealAlert } from "@/lib/server/store";

interface AlertPayload {
  sessionId?: string;
  productId?: string;
  enabled?: boolean;
  targetPrice?: number;
}

export async function POST(request: Request) {
  const payload = (await request.json()) as AlertPayload;
  if (!payload.sessionId || !payload.productId) {
    return NextResponse.json(
      { error: "sessionId and productId are required" },
      { status: 400 },
    );
  }

  updateSavedDealAlert(
    payload.sessionId,
    payload.productId,
    payload.enabled ?? false,
    payload.targetPrice ?? 0,
  );

  return NextResponse.json({
    deals: getSavedDeals(payload.sessionId),
  });
}
