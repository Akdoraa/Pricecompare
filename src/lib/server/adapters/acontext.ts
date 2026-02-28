import { getServerConfig } from "../env";
import type { UserContext } from "../types";

const defaultContext: UserContext = {
  preferredBrands: [],
  budgetUSD: {},
  deliveryPreference: "cheapest",
  blockedSellers: [],
  recentQueries: [],
};

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Acontext request timed out")), timeoutMs);
    promise
      .then((value) => resolve(value))
      .catch((err) => reject(err))
      .finally(() => clearTimeout(timer));
  });
}

export async function getAcontext(sessionId: string): Promise<UserContext> {
  const { acontextApiKey, requestTimeoutMs } = getServerConfig();
  if (!acontextApiKey) return defaultContext;

  try {
    const response = await withTimeout(
      fetch(`https://api.acontext.io/v1/context/${encodeURIComponent(sessionId)}`, {
        headers: {
          Authorization: `Bearer ${acontextApiKey}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }),
      requestTimeoutMs,
    );

    if (!response.ok) return defaultContext;
    const json = (await response.json()) as Partial<UserContext>;
    return {
      ...defaultContext,
      ...json,
    };
  } catch {
    return defaultContext;
  }
}

export async function upsertAcontext(
  sessionId: string,
  patch: Partial<UserContext>,
): Promise<void> {
  const { acontextApiKey, requestTimeoutMs } = getServerConfig();
  if (!acontextApiKey) return;

  try {
    await withTimeout(
      fetch(`https://api.acontext.io/v1/context/${encodeURIComponent(sessionId)}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${acontextApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patch),
        cache: "no-store",
      }),
      requestTimeoutMs,
    );
  } catch {
    // Memory writes are best-effort and should not fail the user flow.
  }
}
