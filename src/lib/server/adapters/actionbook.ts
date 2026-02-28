import { getServerConfig } from "../env";

interface PlaybookConfig {
  sourcePriority: string[];
  retryCount: number;
  tieBreaker: "availability_then_eta";
}

let cachedPlaybook: { value: PlaybookConfig; expiresAt: number } | null = null;

const fallbackPlaybook: PlaybookConfig = {
  sourcePriority: [
    "amazon",
    "walmart",
    "bestbuy",
    "google_shopping",
    "ebay",
    "etsy",
  ],
  retryCount: 1,
  tieBreaker: "availability_then_eta",
};

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Actionbook request timed out")), timeoutMs);
    promise
      .then((value) => resolve(value))
      .catch((err) => reject(err))
      .finally(() => clearTimeout(timer));
  });
}

export async function getActionbookPlaybook(): Promise<PlaybookConfig> {
  const now = Date.now();
  if (cachedPlaybook && cachedPlaybook.expiresAt > now) {
    return cachedPlaybook.value;
  }

  const { actionbookApiKey, requestTimeoutMs } = getServerConfig();
  if (!actionbookApiKey) return fallbackPlaybook;

  try {
    const response = await withTimeout(
      fetch("https://api.actionbook.dev/v1/playbooks/electronics_compare_v1_us", {
        headers: {
          Authorization: `Bearer ${actionbookApiKey}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }),
      requestTimeoutMs,
    );

    if (!response.ok) return fallbackPlaybook;
    const json = (await response.json()) as Partial<PlaybookConfig>;
    const value: PlaybookConfig = {
      ...fallbackPlaybook,
      ...json,
    };
    cachedPlaybook = {
      value,
      expiresAt: now + 10 * 60_000,
    };
    return value;
  } catch {
    return fallbackPlaybook;
  }
}
