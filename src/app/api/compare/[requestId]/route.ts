import { NextResponse } from "next/server";
import { getComparison } from "@/lib/server/compareOrchestrator";

interface RouteParams {
  params: Promise<{
    requestId: string;
  }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { requestId } = await params;
  const job = getComparison(requestId);
  if (!job) {
    return NextResponse.json(
      { error: "Comparison not found", status: "expired" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    requestId: job.requestId,
    status: job.status,
    results: job.results,
    sourceDiagnostics: job.sourceDiagnostics,
    updatedAt: new Date(job.updatedAt).toISOString(),
  });
}
