import fs from "fs";
import path from "path";

type JsonPayload = Record<string, unknown> | unknown[] | null;

export interface RouteResult<T> {
  status: number;
  body: T;
}

export function loadLocalEnvIfPresent() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const idx = trimmed.indexOf("=");
    if (idx <= 0) continue;

    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

export function assertRequiredLiveEnv() {
  const required = [
    "BRIGHTDATA_MCP_SSE_URL",
    "ACONTEXT_API_KEY",
    "ACTIONBOOK_API_KEY",
  ];

  const missing = required.filter((name) => !process.env[name]?.trim());
  if (missing.length > 0) {
    throw new Error(
      `Missing required live integration env vars: ${missing.join(", ")}.`,
    );
  }
}

export function jsonRequest(url: string, method: string, payload?: JsonPayload): Request {
  return new Request(url, {
    method,
    headers: payload ? { "content-type": "application/json" } : undefined,
    body: payload ? JSON.stringify(payload) : undefined,
  });
}

export async function toRouteResult<T>(
  response: Response,
): Promise<RouteResult<T>> {
  return {
    status: response.status,
    body: (await response.json()) as T,
  };
}

export async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
