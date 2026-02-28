import { POST as startComparePost } from "@/app/api/compare/start/route";
import { GET as compareByIdGet } from "@/app/api/compare/[requestId]/route";
import { __resetStoreForTests } from "@/lib/server/store";
import {
  assertRequiredLiveEnv,
  jsonRequest,
  loadLocalEnvIfPresent,
  sleep,
  toRouteResult,
} from "./helpers/compareApiTestUtils";

jest.retryTimes(2, { logErrorsBeforeRetry: true });

const POLL_TIMEOUT_MS = 45_000;
const POLL_INTERVAL_MS = 1_500;

interface StartResponseBody {
  requestId: string | null;
  status: "processing" | "rejected";
  initialResults: unknown[];
  sourcesPending: string[];
  reason?: string;
  error?: string;
}

interface PollResponseBody {
  requestId?: string;
  status: "processing" | "complete" | "partial_error" | "expired";
  results?: Array<{
    id: string;
    store: string;
    title: string;
    totalLandedCost: number;
    displayCurrency: string;
    fetchedAt: string;
  }>;
  sourceDiagnostics?: Array<{
    source: string;
    state: "pending" | "success" | "timeout" | "error";
    latencyMs?: number;
    error?: string;
  }>;
  updatedAt?: string;
  error?: string;
}

describe("compare api integration (live)", () => {
  beforeAll(() => {
    jest.setTimeout(90_000);
    loadLocalEnvIfPresent();
    assertRequiredLiveEnv();
  });

  beforeEach(() => {
    __resetStoreForTests();
  });

  it("returns 400 when required fields are missing", async () => {
    const response = await startComparePost(
      jsonRequest("http://localhost/api/compare/start", "POST", {
        sessionId: "integration-session-1",
      }),
    );
    const result = await toRouteResult<{ error: string }>(response);

    expect(result.status).toBe(400);
    expect(result.body.error).toBe("query and sessionId are required");
  });

  it("rejects non-electronics queries", async () => {
    const response = await startComparePost(
      jsonRequest("http://localhost/api/compare/start", "POST", {
        sessionId: "integration-session-2",
        query: "organic bananas",
      }),
    );
    const result = await toRouteResult<StartResponseBody>(response);

    expect(result.status).toBe(200);
    expect(result.body.status).toBe("rejected");
    expect(result.body.reason).toBe("NON_ELECTRONICS_QUERY");
    expect(result.body.requestId).toBeNull();
  });

  it("starts a comparison job for a valid electronics query", async () => {
    const response = await startComparePost(
      jsonRequest("http://localhost/api/compare/start", "POST", {
        sessionId: "integration-session-3",
        query: "iphone 15 pro",
      }),
    );
    const result = await toRouteResult<StartResponseBody>(response);

    expect(result.status).toBe(200);
    expect(result.body.status).toBe("processing");
    expect(result.body.requestId).toEqual(expect.any(String));
    expect(result.body.sourcesPending).toEqual(
      expect.arrayContaining([
        "amazon",
        "walmart",
        "ebay",
        "etsy",
        "bestbuy",
        "google_shopping",
      ]),
    );
    expect(result.body.sourcesPending).toHaveLength(6);
  });

  it("returns 404 for unknown requestId", async () => {
    const response = await compareByIdGet(
      jsonRequest("http://localhost/api/compare/non-existent", "GET"),
      { params: Promise.resolve({ requestId: "not-a-real-id" }) },
    );
    const result = await toRouteResult<PollResponseBody>(response);

    expect(result.status).toBe(404);
    expect(result.body.status).toBe("expired");
    expect(result.body.error).toBe("Comparison not found");
  });

  it("completes polling lifecycle and returns comparable results", async () => {
    const startResponse = await startComparePost(
      jsonRequest("http://localhost/api/compare/start", "POST", {
        sessionId: "integration-session-4",
        query: "macbook pro m3",
        maxResults: 10,
      }),
    );
    const startResult = await toRouteResult<StartResponseBody>(startResponse);

    expect(startResult.status).toBe(200);
    expect(startResult.body.status).toBe("processing");
    expect(startResult.body.requestId).toEqual(expect.any(String));

    const requestId = startResult.body.requestId as string;
    const terminal = await pollUntilTerminal(requestId);

    expect(["complete", "partial_error"]).toContain(terminal.body.status);
    expect(terminal.status).toBe(200);
    expect(terminal.body.requestId).toBe(requestId);
    expect(terminal.body.sourceDiagnostics).toHaveLength(6);
    const diagnostics = terminal.body.sourceDiagnostics ?? [];
    const hasSuccess = diagnostics.some((diag) => diag.state === "success");
    if (!hasSuccess) {
      expect(
        diagnostics.every(
          (diag) =>
            (diag.state === "error" || diag.state === "timeout") &&
            typeof diag.error === "string" &&
            diag.error.length > 0,
        ),
      ).toBe(true);
    }

    const results = terminal.body.results ?? [];
    expect(Array.isArray(results)).toBe(true);

    if (terminal.body.status === "complete") {
      expect(results.length).toBeGreaterThan(0);
    }

    for (const offer of results) {
      expect(typeof offer.id).toBe("string");
      expect(typeof offer.store).toBe("string");
      expect(typeof offer.title).toBe("string");
      expect(typeof offer.totalLandedCost).toBe("number");
      expect(offer.displayCurrency).toBe("USD");
      expect(new Date(offer.fetchedAt).toString()).not.toBe("Invalid Date");
    }

    for (let index = 1; index < results.length; index += 1) {
      expect(results[index - 1].totalLandedCost).toBeLessThanOrEqual(
        results[index].totalLandedCost,
      );
    }
  });
});

async function pollUntilTerminal(requestId: string) {
  const startedAt = Date.now();
  let lastResponse:
    | Awaited<ReturnType<typeof toRouteResult<PollResponseBody>>>
    | undefined;

  while (Date.now() - startedAt < POLL_TIMEOUT_MS) {
    const response = await compareByIdGet(
      jsonRequest(`http://localhost/api/compare/${requestId}`, "GET"),
      { params: Promise.resolve({ requestId }) },
    );
    const parsed = await toRouteResult<PollResponseBody>(response);
    lastResponse = parsed;

    if (parsed.status === 404) {
      throw new Error(
        `Comparison request ${requestId} expired before completion.`,
      );
    }

    if (parsed.body.status === "complete" || parsed.body.status === "partial_error") {
      return parsed;
    }

    await sleep(POLL_INTERVAL_MS);
  }

  throw new Error(
    `Polling timed out after ${POLL_TIMEOUT_MS}ms. Last response: ${JSON.stringify(lastResponse)}`,
  );
}
