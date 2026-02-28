import { bdclient } from "@brightdata/sdk";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import OpenAI from "openai";
import { getServerConfig } from "../env";
import { computeTotalLandedCost } from "../domains/offers";
import type { ComparisonOffer, SourceName } from "../types";

const SOURCE_TO_TOOL: Record<SourceName, string> = {
  amazon: "web_data_amazon_product",
  walmart: "web_data_walmart_product",
  ebay: "web_data_ebay_product",
  etsy: "web_data_etsy_products",
  bestbuy: "web_data_bestbuy_products",
  google_shopping: "web_data_google_shopping",
};

const SOURCE_CONFIG: Record<SourceName, { domain: string }> = {
  amazon: { domain: "amazon.com" },
  walmart: { domain: "walmart.com" },
  ebay: { domain: "ebay.com" },
  etsy: { domain: "etsy.com" },
  bestbuy: { domain: "bestbuy.com" },
  google_shopping: { domain: "shopping.google.com" },
};

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Bright Data request timed out")), timeoutMs);
    promise
      .then((value) => resolve(value))
      .catch((err) => reject(err))
      .finally(() => clearTimeout(timer));
  });
}

function parseNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.]/g, "");
    const numeric = Number(cleaned);
    if (Number.isFinite(numeric)) return numeric;
  }
  return fallback;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function extractRowsFromPayload(payload: unknown): Array<Record<string, unknown>> {
  if (Array.isArray(payload)) {
    return payload.filter((item): item is Record<string, unknown> => !!asRecord(item));
  }

  const obj = asRecord(payload);
  if (!obj) return [];

  const candidates = [
    "results",
    "items",
    "products",
    "data",
    "organic",
    "organic_results",
    "shopping_results",
  ];
  for (const key of candidates) {
    const candidate = obj[key];
    if (Array.isArray(candidate)) {
      return candidate.filter((item): item is Record<string, unknown> => !!asRecord(item));
    }
  }

  return [];
}

function parseToolContent(content: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(content)) return [];

  for (const block of content) {
    const blockObj = asRecord(block);
    if (!blockObj) continue;

    const blockJsonRows = extractRowsFromPayload(blockObj.json);
    if (blockJsonRows.length > 0) return blockJsonRows;

    const blockDataRows = extractRowsFromPayload(blockObj.data);
    if (blockDataRows.length > 0) return blockDataRows;

    const text = blockObj.text;
    if (typeof text !== "string") continue;
    try {
      const parsed = JSON.parse(text);
      const rows = extractRowsFromPayload(parsed);
      if (rows.length > 0) return rows;
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is Record<string, unknown> => !!asRecord(item));
      }
    } catch {
      continue;
    }
  }

  return [];
}

function parseMcpToolResult(result: unknown): Array<Record<string, unknown>> {
  const obj = asRecord(result);
  if (!obj) return [];

  const structured = obj.structuredContent;
  const structuredRows = extractRowsFromPayload(structured);
  if (structuredRows.length > 0) return structuredRows;

  const rawRows = extractRowsFromPayload(obj);
  if (rawRows.length > 0) return rawRows;

  return parseToolContent(obj.content);
}

function normalizeErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }
  if (typeof error === "string" && error.trim()) {
    return error.trim();
  }
  return "Unknown error";
}

function joinErrors(...messages: Array<string | undefined>): string | undefined {
  const unique = [...new Set(messages.filter((message): message is string => Boolean(message?.trim())))];
  return unique.length ? unique.join(" | ") : undefined;
}

function extractJsonFromText(text: string): unknown {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const parseCandidate = (candidate: string): unknown => {
    try {
      return JSON.parse(candidate);
    } catch {
      return null;
    }
  };

  const parsedWhole = parseCandidate(trimmed);
  if (parsedWhole !== null) return parsedWhole;

  const fencedMatch = trimmed.match(/```json\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) {
    const parsedFence = parseCandidate(fencedMatch[1]);
    if (parsedFence !== null) return parsedFence;
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    const parsedObjectSlice = parseCandidate(trimmed.slice(firstBrace, lastBrace + 1));
    if (parsedObjectSlice !== null) return parsedObjectSlice;
  }

  const firstBracket = trimmed.indexOf("[");
  const lastBracket = trimmed.lastIndexOf("]");
  if (firstBracket >= 0 && lastBracket > firstBracket) {
    const parsedArraySlice = parseCandidate(trimmed.slice(firstBracket, lastBracket + 1));
    if (parsedArraySlice !== null) return parsedArraySlice;
  }

  return null;
}

function toOpenAiMcpServerUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.pathname.endsWith("/sse")) {
      parsed.pathname = parsed.pathname.replace(/\/sse$/, "/mcp");
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

function initSourceMaps(sources: SourceName[]): {
  offersBySource: Record<SourceName, ComparisonOffer[]>;
  errorsBySource: Record<SourceName, string | undefined>;
} {
  const offersBySource = {} as Record<SourceName, ComparisonOffer[]>;
  const errorsBySource = {} as Record<SourceName, string | undefined>;
  for (const source of sources) {
    offersBySource[source] = [];
    errorsBySource[source] = undefined;
  }
  return { offersBySource, errorsBySource };
}

function parseOpenAiPayload(
  payload: unknown,
  sources: SourceName[],
): {
  rowsBySource: Record<SourceName, Array<Record<string, unknown>>>;
  errorsBySource: Record<SourceName, string | undefined>;
} {
  const rowsBySource = {} as Record<SourceName, Array<Record<string, unknown>>>;
  const errorsBySource = {} as Record<SourceName, string | undefined>;
  for (const source of sources) {
    rowsBySource[source] = [];
    errorsBySource[source] = undefined;
  }

  const obj = asRecord(payload);
  if (!obj) return { rowsBySource, errorsBySource };

  const offersBySource = asRecord(obj.offersBySource);
  if (offersBySource) {
    for (const source of sources) {
      const sourceRows = extractRowsFromPayload(offersBySource[source]);
      if (sourceRows.length > 0) rowsBySource[source] = sourceRows;
    }
  }

  const plainOffers = Array.isArray(obj.offers)
    ? obj.offers.filter((item): item is Record<string, unknown> => !!asRecord(item))
    : [];
  for (const row of plainOffers) {
    const source = String(row.source ?? row.store ?? "").toLowerCase() as SourceName;
    if (sources.includes(source)) {
      rowsBySource[source].push(row);
    }
  }

  for (const source of sources) {
    if (rowsBySource[source].length === 0) {
      const directRows = extractRowsFromPayload(obj[source]);
      if (directRows.length > 0) rowsBySource[source] = directRows;
    }
  }

  const rawErrors = asRecord(obj.errorsBySource);
  if (rawErrors) {
    for (const source of sources) {
      const value = rawErrors[source];
      if (typeof value === "string" && value.trim()) errorsBySource[source] = value.trim();
    }
  }

  return { rowsBySource, errorsBySource };
}

function buildSourceSearchUrl(source: SourceName, query: string): string {
  const encoded = encodeURIComponent(query);
  switch (source) {
    case "amazon":
      return `https://www.amazon.com/s?k=${encoded}`;
    case "walmart":
      return `https://www.walmart.com/search?q=${encoded}`;
    case "ebay":
      return `https://www.ebay.com/sch/i.html?_nkw=${encoded}`;
    case "etsy":
      return `https://www.etsy.com/search?q=${encoded}`;
    case "bestbuy":
      return `https://www.bestbuy.com/site/searchpage.jsp?st=${encoded}`;
    case "google_shopping":
      return `https://www.google.com/search?tbm=shop&q=${encoded}`;
    default:
      return `https://www.google.com/search?q=${encoded}`;
  }
}

function buildToolArguments(
  source: SourceName,
  query: string,
  toolDefinition?: Record<string, unknown>,
): Record<string, unknown> {
  const args: Record<string, unknown> = {};
  const inputSchema = asRecord(toolDefinition?.inputSchema);
  const properties = asRecord(inputSchema?.properties);

  const hasProp = (name: string) => Boolean(properties && name in properties);

  if (hasProp("query")) args.query = query;
  if (hasProp("search")) args.search = query;
  if (hasProp("search_term")) args.search_term = query;
  if (hasProp("keyword")) args.keyword = query;
  if (hasProp("keywords")) args.keywords = query;
  if (hasProp("url")) args.url = buildSourceSearchUrl(source, query);
  if (hasProp("urls")) args.urls = [buildSourceSearchUrl(source, query)];
  if (hasProp("country")) args.country = "US";
  if (hasProp("country_code")) args.country_code = "US";
  if (hasProp("marketplace")) args.marketplace = "US";
  if (hasProp("category")) args.category = "electronics";
  if (hasProp("max_results")) args.max_results = 6;
  if (hasProp("num_results")) args.num_results = 6;
  if (hasProp("maxResults")) args.maxResults = 6;
  if (hasProp("limit")) args.limit = 6;
  if (hasProp("count")) args.count = 6;

  if (Object.keys(args).length === 0) {
    args.query = query;
  }

  return args;
}

function parseSdkSearchBody(payload: unknown): Array<Record<string, unknown>> {
  const record = asRecord(payload);
  if (record && typeof record.body === "string") {
    try {
      const bodyJson = JSON.parse(record.body);
      return extractRowsFromPayload(bodyJson);
    } catch {
      return [];
    }
  }
  return extractRowsFromPayload(payload);
}

function normalizeOffer(source: SourceName, raw: Record<string, unknown>): ComparisonOffer {
  const title = String(raw.title ?? raw.name ?? raw.product ?? "Unknown product");
  const itemPrice = parseNumber(raw.price ?? raw.current_price ?? raw.offer_price, 0);
  const shippingPrice = parseNumber(raw.shipping_price ?? raw.shipping ?? raw.shipping_cost, 0);
  const fees = parseNumber(raw.fees ?? raw.platform_fee, 0);
  const estimatedTax = parseNumber(raw.tax ?? raw.estimated_tax, itemPrice * 0.07);

  const availabilityValue = String(raw.availability ?? raw.stock ?? "unknown").toLowerCase();
  const partial = {
    id: `${source}-${Math.random().toString(36).slice(2, 10)}`,
    title,
    category: String(raw.category ?? "Electronics"),
    store: source,
    productUrl: String(raw.url ?? raw.link ?? raw.product_url ?? "#"),
    image: typeof raw.image === "string" ? raw.image : undefined,
    itemPrice,
    shippingPrice,
    fees,
    estimatedTax,
    originalCurrency: String(raw.currency ?? "USD"),
    displayCurrency: "USD" as const,
    availability: availabilityValue.includes("in")
      ? ("in_stock" as const)
      : availabilityValue.includes("limited")
        ? ("limited" as const)
        : ("unknown" as const),
    deliveryEta: String(raw.delivery_eta ?? raw.delivery ?? raw.delivery_time ?? "Unknown"),
    seller:
      typeof raw.seller === "string"
        ? raw.seller
        : typeof raw.store === "string"
          ? raw.store
          : undefined,
    fetchedAt: new Date().toISOString(),
  };

  return {
    ...partial,
    totalLandedCost: computeTotalLandedCost(partial),
  };
}

async function searchWithSdk(
  client: bdclient,
  source: SourceName,
  query: string,
  timeoutMs: number,
): Promise<ComparisonOffer[]> {
  const { domain } = SOURCE_CONFIG[source];
  const payload = await withTimeout(
    client.search(query, {
      searchEngine: "google",
      format: "json",
      country: "us",
      timeout: timeoutMs,
      concurrency: 1,
      method: "GET",
    }),
    timeoutMs,
  );

  let rows = parseSdkSearchBody(payload);
  rows = rows.filter((row) => {
    const url = String(row.url ?? row.link ?? row.product_url ?? "");
    return url.includes(domain);
  });

  return rows.map((row) => normalizeOffer(source, row)).filter((offer) => offer.productUrl !== "#");
}

function buildMcpEnv(
  apiToken: string,
  groups?: string,
  tools?: string,
): Record<string, string> {
  const env: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (typeof value === "string") env[key] = value;
  }

  env.API_TOKEN = apiToken;
  env.GROUPS = groups || "advanced_scraping";
  env.TOOLS =
    tools ||
    Object.values(SOURCE_TO_TOOL).join(",");
  return env;
}

async function fetchWithOpenAiMcp(
  query: string,
  sources: SourceName[],
): Promise<{
  offersBySource: Record<SourceName, ComparisonOffer[]>;
  errorsBySource: Record<SourceName, string | undefined>;
}> {
  const { openAiApiKey, openAiModel, brightDataMcpUrl, requestTimeoutMs } = getServerConfig();
  const empty = initSourceMaps(sources);
  if (!openAiApiKey) {
    for (const source of sources) {
      empty.errorsBySource[source] = "OPENAI_API_KEY is missing";
    }
    return empty;
  }
  if (!brightDataMcpUrl) {
    for (const source of sources) {
      empty.errorsBySource[source] = "BRIGHTDATA_MCP_SSE_URL is missing";
    }
    return empty;
  }

  const timeoutMs = Math.max(requestTimeoutMs, 45_000);
  const client = new OpenAI({ apiKey: openAiApiKey });
  const allowedTools = sources.map((source) => SOURCE_TO_TOOL[source]);
  const serverUrl = toOpenAiMcpServerUrl(brightDataMcpUrl);
  const instructions = [
    "Use the Bright Data MCP tools to find US electronics product listings for the user query.",
    `Query: ${query}`,
    `Sources/tools required: ${allowedTools.join(", ")}`,
    "Return strict JSON only (no markdown) with this shape:",
    "{",
    '  "offersBySource": { "<source>": [ { "title": string, "url": string, "price": number|string, "currency": "USD", "shipping": number|string, "tax": number|string, "availability": string, "seller": string, "image": string, "deliveryEta": string, "category": string } ] },',
    '  "errorsBySource": { "<source>": string | null }',
    "}",
    "If a source has no result, return an empty array and a helpful error message for that source.",
  ].join("\n");

  try {
    const response = await withTimeout(
      client.responses.create({
        model: openAiModel,
        input: instructions,
        tools: [
          {
            type: "mcp",
            server_label: "bright_data",
            server_url: serverUrl,
            require_approval: "never",
            allowed_tools: allowedTools,
          },
        ],
      }),
      timeoutMs,
    );

    const outputText =
      typeof response.output_text === "string"
        ? response.output_text
        : String((response as { output_text?: unknown }).output_text ?? "");
    const parsedPayload = extractJsonFromText(outputText);
    const parsed = parseOpenAiPayload(parsedPayload, sources);

    for (const source of sources) {
      empty.offersBySource[source] = parsed.rowsBySource[source]
        .map((row) => normalizeOffer(source, row))
        .filter((offer) => offer.productUrl !== "#");
      if (empty.offersBySource[source].length === 0) {
        empty.errorsBySource[source] =
          parsed.errorsBySource[source] ??
          (outputText.trim()
            ? "OpenAI MCP returned no parseable offers for source"
            : "OpenAI MCP returned empty response");
      }
    }
  } catch (error) {
    const message = `OpenAI MCP call failed: ${normalizeErrorMessage(error)}`;
    for (const source of sources) {
      empty.errorsBySource[source] = message;
    }
  }

  return empty;
}

async function fetchWithMcp(
  query: string,
  sources: SourceName[],
): Promise<{
  offersBySource: Record<SourceName, ComparisonOffer[]>;
  errorsBySource: Record<SourceName, string | undefined>;
}> {
  const {
    brightDataApiKey,
    brightDataGroups,
    brightDataTools,
    brightDataMcpUrl,
    requestTimeoutMs,
  } = getServerConfig();
  const empty = {} as Record<SourceName, ComparisonOffer[]>;
  const errors = {} as Record<SourceName, string | undefined>;
  for (const source of sources) {
    empty[source] = [];
    errors[source] = undefined;
  }
  if (!brightDataApiKey) {
    for (const source of sources) {
      errors[source] = "Missing Bright Data API token";
    }
    return { offersBySource: empty, errorsBySource: errors };
  }

  const mcpTimeout = Math.max(requestTimeoutMs, 45_000);
  const pending = new Set(sources);

  const attemptMcp = async (
    mode: "sse" | "stdio",
    subset: SourceName[],
  ): Promise<{
    offersBySource: Record<SourceName, ComparisonOffer[]>;
    errorsBySource: Record<SourceName, string | undefined>;
  }> => {
    const offersBySource = {} as Record<SourceName, ComparisonOffer[]>;
    const errorsBySource = {} as Record<SourceName, string | undefined>;
    for (const source of subset) {
      offersBySource[source] = [];
      errorsBySource[source] = undefined;
    }

    const client = new Client({ name: "pricecompare", version: "0.1.0" });
    let transport: SSEClientTransport | StdioClientTransport;
    try {
      transport =
        mode === "sse"
          ? new SSEClientTransport(new URL(brightDataMcpUrl!))
          : new StdioClientTransport({
              command: "npx",
              args: ["-y", "@brightdata/mcp"],
              env: buildMcpEnv(brightDataApiKey, brightDataGroups, brightDataTools),
              stderr: "pipe",
            });
    } catch (error) {
      const message = `${mode}: MCP transport init failed: ${normalizeErrorMessage(error)}`;
      for (const source of subset) {
        errorsBySource[source] = message;
      }
      return { offersBySource, errorsBySource };
    }

    try {
      await withTimeout(client.connect(transport), mcpTimeout);
      const listedTools = await withTimeout(client.listTools(), mcpTimeout);
      const toolsByName = new Map(
        (listedTools.tools ?? []).map((tool) => [tool.name, tool as Record<string, unknown>]),
      );

      await Promise.all(
        subset.map(async (source) => {
          try {
            const toolName = SOURCE_TO_TOOL[source];
            const toolDefinition = toolsByName.get(toolName);
            if (!toolDefinition) {
              errorsBySource[source] = `${mode}: tool ${toolName} unavailable`;
              offersBySource[source] = [];
              return;
            }

            const result = await withTimeout(
              client.callTool({
                name: toolName,
                arguments: buildToolArguments(source, query, toolDefinition),
              }),
              mcpTimeout,
            );

            const rows = parseMcpToolResult(result);
            offersBySource[source] = rows
              .map((row) => normalizeOffer(source, row))
              .filter((offer) => offer.productUrl !== "#");
            if (offersBySource[source].length === 0) {
              errorsBySource[source] = `${mode}: tool returned no parseable rows`;
            }
          } catch (error) {
            offersBySource[source] = [];
            errorsBySource[source] = `${mode}: tool call failed: ${normalizeErrorMessage(error)}`;
          }
        }),
      );
    } catch (error) {
      const message = `${mode}: MCP connection failed: ${normalizeErrorMessage(error)}`;
      for (const source of subset) {
        errorsBySource[source] = message;
      }
    } finally {
      await client.close();
    }

    return { offersBySource, errorsBySource };
  };

  const attemptOrder: Array<"sse" | "stdio"> = [];
  if (brightDataMcpUrl) attemptOrder.push("sse");
  attemptOrder.push("stdio");

  for (const mode of attemptOrder) {
    if (pending.size === 0) break;
    const subset = [...pending];
    const attemptResult = await attemptMcp(mode, subset);
    for (const source of subset) {
      const offers = attemptResult.offersBySource[source] ?? [];
      if (offers.length > 0) {
        empty[source] = offers;
        errors[source] = undefined;
        pending.delete(source);
      } else {
        errors[source] = attemptResult.errorsBySource[source] ?? errors[source];
      }
    }
  }

  for (const source of pending) {
    errors[source] = errors[source] ?? "MCP request failed for this source";
  }

  return { offersBySource: empty, errorsBySource: errors };
}

export async function fetchBrightDataOffers(query: string): Promise<{
  offersBySource: Record<SourceName, ComparisonOffer[]>;
  durations: Record<SourceName, number>;
  errorsBySource: Record<SourceName, string | undefined>;
}> {
  const { brightDataApiKey, brightDataTools, openAiApiKey, brightDataMcpUrl, requestTimeoutMs } =
    getServerConfig();
  const allSources: SourceName[] = [
    "amazon",
    "walmart",
    "ebay",
    "etsy",
    "bestbuy",
    "google_shopping",
  ];
  const enabledTools = new Set(
    (brightDataTools ?? "")
      .split(",")
      .map((tool) => tool.trim())
      .filter(Boolean),
  );
  const sources = enabledTools.size
    ? allSources.filter((source) => enabledTools.has(SOURCE_TO_TOOL[source]))
    : allSources;

  const offersBySource = {} as Record<SourceName, ComparisonOffer[]>;
  const durations = {} as Record<SourceName, number>;
  const errorsBySource = {} as Record<SourceName, string | undefined>;

  if (!brightDataApiKey) {
    for (const source of allSources) {
      offersBySource[source] = [];
      durations[source] = 0;
      errorsBySource[source] = "Missing Bright Data API token";
    }
    return { offersBySource, durations, errorsBySource };
  }

  const openAiEnabled = Boolean(openAiApiKey && brightDataMcpUrl);
  let openAiResults = initSourceMaps(sources);
  let openAiDuration = 0;
  if (openAiEnabled) {
    const openAiStart = Date.now();
    openAiResults = await fetchWithOpenAiMcp(query, sources);
    openAiDuration = Date.now() - openAiStart;
  }

  const pendingForMcp = sources.filter((source) => openAiResults.offersBySource[source].length === 0);
  let mcpResults = initSourceMaps(pendingForMcp);
  let mcpDuration = 0;
  if (pendingForMcp.length > 0) {
    const mcpStart = Date.now();
    mcpResults = await fetchWithMcp(query, pendingForMcp);
    mcpDuration = Date.now() - mcpStart;
  }

  const sdkClient = new bdclient({ apiKey: brightDataApiKey });
  await Promise.all(
    sources.map(async (source) => {
      const start = Date.now();
      const triedMcp = pendingForMcp.includes(source);
      let offers = openAiResults.offersBySource[source] ?? [];
      let sourceError = openAiEnabled ? openAiResults.errorsBySource[source] : undefined;
      if (offers.length === 0 && triedMcp) {
        offers = mcpResults.offersBySource[source] ?? [];
        sourceError = joinErrors(sourceError, mcpResults.errorsBySource[source]);
      }
      if (offers.length === 0) {
        try {
          offers = await searchWithSdk(
            sdkClient,
            source,
            `${query} site:${SOURCE_CONFIG[source].domain}`,
            requestTimeoutMs,
          );
          if (offers.length === 0) {
            sourceError = sourceError ?? "SDK search returned no parseable rows";
          } else {
            sourceError = undefined;
          }
        } catch (error) {
          offers = [];
          sourceError = sourceError ?? `SDK search failed: ${normalizeErrorMessage(error)}`;
        }
      }
      offersBySource[source] = offers;
      durations[source] =
        Date.now() - start + openAiDuration + (triedMcp ? mcpDuration : 0);
      errorsBySource[source] = sourceError;
    }),
  );

  for (const source of allSources) {
    if (!offersBySource[source]) {
      offersBySource[source] = [];
      durations[source] = 0;
      errorsBySource[source] = errorsBySource[source] ?? "Source disabled";
    }
  }

  return { offersBySource, durations, errorsBySource };
}
