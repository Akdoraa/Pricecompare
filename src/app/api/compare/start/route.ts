import { NextResponse } from "next/server";
import { isElectronicsQuery } from "@/lib/server/domains/electronicsClassifier";
import { startComparison } from "@/lib/server/compareOrchestrator";
import type { CompareStartInput } from "@/lib/server/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<CompareStartInput>;
    if (!body.query || !body.sessionId) {
      return NextResponse.json(
        { error: "query and sessionId are required" },
        { status: 400 },
      );
    }

    if (!isElectronicsQuery(body.query)) {
      return NextResponse.json({
        requestId: null,
        status: "rejected",
        initialResults: [],
        sourcesPending: [],
        reason: "NON_ELECTRONICS_QUERY",
      });
    }

    const result = await startComparison({
      query: body.query,
      sessionId: body.sessionId,
      maxResults: body.maxResults,
      postalCode: body.postalCode,
      filters: body.filters,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 },
    );
  }
}
