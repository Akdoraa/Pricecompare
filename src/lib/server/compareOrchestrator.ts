import { randomUUID } from "crypto";
import { getActionbookPlaybook } from "./adapters/actionbook";
import { fetchBrightDataOffers } from "./adapters/brightdataMcp";
import { getAcontext, upsertAcontext } from "./adapters/acontext";
import { dedupeOffers, sortOffers } from "./domains/offers";
import { getServerConfig } from "./env";
import { createJob, getJob, updateJob } from "./store";
import type { CompareStartInput, ComparisonJob, SourceName } from "./types";

export async function startComparison(input: CompareStartInput) {
  const { jobTtlMs } = getServerConfig();
  const requestId = randomUUID();
  const now = Date.now();
  const sources: SourceName[] = [
    "amazon",
    "walmart",
    "ebay",
    "etsy",
    "bestbuy",
    "google_shopping",
  ];

  const job: ComparisonJob = {
    requestId,
    sessionId: input.sessionId,
    query: input.query,
    status: "processing",
    results: [],
    sourceDiagnostics: sources.map((source) => ({ source, state: "pending" })),
    createdAt: now,
    updatedAt: now,
    expiresAt: now + jobTtlMs,
  };

  createJob(job);
  void runComparison(requestId, input);

  return {
    requestId,
    status: "processing" as const,
    initialResults: [],
    sourcesPending: sources,
  };
}

async function runComparison(requestId: string, input: CompareStartInput) {
  const sources: SourceName[] = [
    "amazon",
    "walmart",
    "ebay",
    "etsy",
    "bestbuy",
    "google_shopping",
  ];
  const playbook = await getActionbookPlaybook();
  const context = await getAcontext(input.sessionId);

  const { offersBySource, durations, errorsBySource } = await fetchBrightDataOffers(input.query);

  const allOffers = Object.entries(offersBySource)
    .sort((a, b) => playbook.sourcePriority.indexOf(a[0]) - playbook.sourcePriority.indexOf(b[0]))
    .flatMap(([, offers]) => offers);

  let filteredOffers = allOffers;
  if (input.filters?.minPrice !== undefined) {
    filteredOffers = filteredOffers.filter((offer) => offer.totalLandedCost >= input.filters!.minPrice!);
  }
  if (input.filters?.maxPrice !== undefined) {
    filteredOffers = filteredOffers.filter((offer) => offer.totalLandedCost <= input.filters!.maxPrice!);
  }
  if (context.preferredBrands?.length) {
    const brands = context.preferredBrands.map((brand) => brand.toLowerCase());
    filteredOffers = filteredOffers.sort((a, b) => {
      const aPreferred = brands.some((brand) => a.title.toLowerCase().includes(brand));
      const bPreferred = brands.some((brand) => b.title.toLowerCase().includes(brand));
      if (aPreferred === bPreferred) return 0;
      return aPreferred ? -1 : 1;
    });
  }

  const deduped = dedupeOffers(filteredOffers);
  const ranked = sortOffers(deduped).slice(0, input.maxResults ?? 10);
  const sourceDiagnostics = sources.map((source) => {
    const hasOffers = offersBySource[source].length > 0;
    const rawError = errorsBySource[source];
    const isTimeout = Boolean(rawError && rawError.toLowerCase().includes("timeout"));

    return {
      source,
      state: hasOffers ? ("success" as const) : isTimeout ? ("timeout" as const) : ("error" as const),
      latencyMs: durations[source],
      error: hasOffers ? undefined : rawError ?? "No data returned",
    };
  });
  const hasFailures = sourceDiagnostics.some((diag) => diag.state !== "success");

  updateJob(requestId, (current) => ({
    ...current,
    status: hasFailures ? "partial_error" : "complete",
    results: ranked,
    sourceDiagnostics,
    updatedAt: Date.now(),
  }));

  await upsertAcontext(input.sessionId, {
    recentQueries: [input.query, ...(context.recentQueries ?? []).slice(0, 4)],
  });
}

export function getComparison(requestId: string) {
  return getJob(requestId);
}
