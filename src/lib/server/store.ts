import { PRODUCT_DETAILS } from "@/lib/data";
import type { ComparisonJob, SavedDeal } from "./types";

const jobs = new Map<string, ComparisonJob>();
const savedDealsBySession = new Map<string, Map<string, SavedDeal>>();
const jobCleanupIntervalMs = 60_000;

let cleanupStarted = false;

function startCleanup() {
  if (cleanupStarted) return;
  cleanupStarted = true;
  const interval = setInterval(() => {
    const now = Date.now();
    for (const [key, job] of jobs) {
      if (job.expiresAt <= now) {
        jobs.delete(key);
      }
    }
  }, jobCleanupIntervalMs);

  if (typeof (interval as NodeJS.Timeout).unref === "function") {
    (interval as NodeJS.Timeout).unref();
  }
}

export function createJob(job: ComparisonJob) {
  startCleanup();
  jobs.set(job.requestId, job);
}

export function getJob(requestId: string): ComparisonJob | undefined {
  const job = jobs.get(requestId);
  if (!job) return undefined;

  if (job.expiresAt <= Date.now()) {
    jobs.delete(requestId);
    return { ...job, status: "expired" };
  }
  return job;
}

export function updateJob(
  requestId: string,
  updater: (job: ComparisonJob) => ComparisonJob,
): ComparisonJob | undefined {
  const current = jobs.get(requestId);
  if (!current) return undefined;
  const next = updater(current);
  jobs.set(requestId, next);
  return next;
}

export function getSavedDeals(sessionId: string): SavedDeal[] {
  const map = savedDealsBySession.get(sessionId);
  if (!map) return [];
  return [...map.values()].sort((a, b) => b.savedAt - a.savedAt);
}

export function toggleSavedDeal(sessionId: string, productId: string) {
  let map = savedDealsBySession.get(sessionId);
  if (!map) {
    map = new Map<string, SavedDeal>();
    savedDealsBySession.set(sessionId, map);
  }

  const existing = map.get(productId);
  if (existing) {
    map.delete(productId);
    return { saved: false };
  }

  const detail = PRODUCT_DETAILS[productId];
  const priceAtSave = detail?.basePrice ?? 0;
  map.set(productId, {
    productId,
    savedAt: Date.now(),
    priceAtSave,
    alert: { enabled: false, targetPrice: 0 },
  });
  return { saved: true };
}

export function updateSavedDealAlert(
  sessionId: string,
  productId: string,
  enabled: boolean,
  targetPrice: number,
) {
  let map = savedDealsBySession.get(sessionId);
  if (!map) {
    map = new Map<string, SavedDeal>();
    savedDealsBySession.set(sessionId, map);
  }

  const current = map.get(productId);
  if (!current) {
    const detail = PRODUCT_DETAILS[productId];
    map.set(productId, {
      productId,
      savedAt: Date.now(),
      priceAtSave: detail?.basePrice ?? 0,
      alert: { enabled, targetPrice },
    });
    return;
  }

  map.set(productId, {
    ...current,
    alert: { enabled, targetPrice },
  });
}

export function __resetStoreForTests() {
  jobs.clear();
  savedDealsBySession.clear();
}
