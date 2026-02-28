"use server";

import { isElectronicsQuery } from "@/lib/server/domains/electronicsClassifier";
import { getComparison, startComparison } from "@/lib/server/compareOrchestrator";
import type { CompareStartInput } from "@/lib/server/types";

export async function startComparisonAction(input: CompareStartInput) {
  if (!isElectronicsQuery(input.query)) {
    return {
      requestId: null,
      status: "rejected" as const,
      initialResults: [],
      sourcesPending: [],
      reason: "NON_ELECTRONICS_QUERY",
    };
  }

  return startComparison(input);
}

export async function getComparisonStatusAction(requestId: string) {
  const job = getComparison(requestId);
  if (!job) {
    return {
      status: "expired",
      results: [],
      sourceDiagnostics: [],
    };
  }

  return {
    status: job.status,
    results: job.results,
    sourceDiagnostics: job.sourceDiagnostics,
    updatedAt: new Date(job.updatedAt).toISOString(),
  };
}
