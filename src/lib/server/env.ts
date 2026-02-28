const REQUIRED_ENV = [
  "BRIGHTDATA_MCP_SSE_URL",
  "ACONTEXT_API_KEY",
  "ACTIONBOOK_API_KEY",
] as const;

export function getEnv(name: (typeof REQUIRED_ENV)[number]): string | undefined {
  const value = process.env[name];
  return value && value.trim() ? value : undefined;
}

export function getServerConfig() {
  const brightDataMcpUrl =
    process.env.BRIGHTDATA_MCP_URL?.trim() || getEnv("BRIGHTDATA_MCP_SSE_URL");
  const explicitBrightDataApiKey =
    process.env.BRIGHTDATA_API_KEY?.trim() ?? process.env.API_TOKEN?.trim();
  let derivedBrightDataApiKey: string | undefined;

  if (!explicitBrightDataApiKey && brightDataMcpUrl) {
    try {
      const parsed = new URL(brightDataMcpUrl);
      derivedBrightDataApiKey = parsed.searchParams.get("token") ?? undefined;
    } catch {
      derivedBrightDataApiKey = undefined;
    }
  }

  return {
    brightDataMcpUrl,
    brightDataApiKey: explicitBrightDataApiKey ?? derivedBrightDataApiKey,
    brightDataGroups: process.env.GROUPS?.trim(),
    brightDataTools: process.env.TOOLS?.trim(),
    openAiApiKey: process.env.OPENAI_API_KEY?.trim(),
    openAiModel: process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini",
    acontextApiKey: getEnv("ACONTEXT_API_KEY"),
    actionbookApiKey: getEnv("ACTIONBOOK_API_KEY"),
    requestTimeoutMs: Number(process.env.REQUEST_TIMEOUT_MS ?? "12000"),
    cacheTtlMs: Number(process.env.COMPARE_CACHE_TTL_MS ?? "180000"),
    jobTtlMs: Number(process.env.JOB_TTL_MS ?? "600000"),
  };
}
