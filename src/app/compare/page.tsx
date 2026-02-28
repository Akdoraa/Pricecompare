"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle2, Clock3, Loader2, TriangleAlert } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getOrCreateSessionId } from "@/lib/client/session";
import {
  getComparisonStatusAction,
  startComparisonAction,
} from "./actions";

type CompareStatus =
  | "idle"
  | "processing"
  | "complete"
  | "partial_error"
  | "rejected"
  | "expired";

interface CompareResult {
  store: string;
  title: string;
  totalLandedCost: number;
  productUrl: string;
}

interface SourceDiagnostic {
  source: string;
  state: "pending" | "success" | "timeout" | "error";
  latencyMs?: number;
  error?: string;
}

const TERMINAL_STATES: CompareStatus[] = ["complete", "partial_error", "expired"];

function formatSourceName(source: string) {
  return source.replace("_", " ");
}

export default function ComparePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");
  const [requestId, setRequestId] = useState<string | null>(null);
  const [status, setStatus] = useState<CompareStatus>("idle");
  const [results, setResults] = useState<CompareResult[]>([]);
  const [sourceDiagnostics, setSourceDiagnostics] = useState<SourceDiagnostic[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const title = useMemo(() => {
    if (status === "processing") return "Searching prices...";
    if (status === "partial_error") return "Comparison Completed with Partial Errors";
    if (status === "complete") return "Comparison Completed";
    if (status === "rejected") return "Electronics only";
    if (status === "expired") return "Comparison expired";
    return "Compare Electronics Prices";
  }, [status]);

  const diagnosticSummary = useMemo(() => {
    let success = 0;
    let pending = 0;
    let timeout = 0;
    let error = 0;

    for (const item of sourceDiagnostics) {
      if (item.state === "success") success += 1;
      if (item.state === "pending") pending += 1;
      if (item.state === "timeout") timeout += 1;
      if (item.state === "error") error += 1;
    }

    return { success, pending, timeout, error };
  }, [sourceDiagnostics]);

  useEffect(() => {
    if (!requestId || status !== "processing") return;
    const timer = setInterval(async () => {
      const response = await getComparisonStatusAction(requestId);
      setResults(response.results as typeof results);
      setSourceDiagnostics(response.sourceDiagnostics as SourceDiagnostic[]);
      setUpdatedAt(response.updatedAt ?? null);
      setStatus(response.status as CompareStatus);
      if (TERMINAL_STATES.includes(response.status as CompareStatus)) {
        clearInterval(timer);
      }
    }, 1500);

    return () => clearInterval(timer);
  }, [requestId, status]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const normalizedQuery = query.trim();
    if (!normalizedQuery) return;

    setStatus("processing");
    setResults([]);
    setUpdatedAt(null);
    setSourceDiagnostics([]);

    const sessionId = getOrCreateSessionId();
    const response = await startComparisonAction({
      query: normalizedQuery,
      sessionId,
      maxResults: 10,
    });

    setStatus(response.status as CompareStatus);
    setResults((response.initialResults ?? []) as typeof results);
    setRequestId(response.requestId);
    setSourceDiagnostics(
      (response.sourcesPending ?? []).map((source: string) => ({
        source,
        state: "pending",
      })),
    );
  };

  return (
    <DashboardLayout searchTerm={searchTerm} onSearchChange={setSearchTerm}>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">{title}</h1>
        <p className="text-muted-foreground">
          Compare Amazon, Walmart, eBay, Etsy, Best Buy, and Google Shopping.
        </p>
      </div>

      <div className="mb-8 rounded-xl border border-border bg-card p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="outline">OpenAI Responses MCP</Badge>
          <Badge variant="outline">Bright Data MCP Tools</Badge>
          <Badge variant="outline">Acontext Memory</Badge>
          <Badge variant="outline">Actionbook Playbook</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Live flow: OpenAI MCP first, then direct Bright Data MCP, then SDK fallback. Results are ranked with
          Actionbook rules and user context from Acontext.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-8">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search electronics (e.g. iPhone 15, RTX 5090, MacBook Pro)"
          className="flex-1 bg-input-background"
        />
        <Button type="submit">Compare</Button>
      </form>

      {status === "rejected" && (
        <div className="bg-card rounded-xl border border-border p-6 mb-8">
          <p className="text-muted-foreground">
            This tool only supports electronics searches in US dollars.
          </p>
        </div>
      )}

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Store</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Product</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Total Cost (USD)</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={`${result.store}-${index}`} className="border-b border-border last:border-0">
                <td className="px-6 py-4 capitalize">{result.store.replace("_", " ")}</td>
                <td className="px-6 py-4">
                  <a href={result.productUrl} className="hover:underline" target="_blank" rel="noreferrer">
                    {result.title}
                  </a>
                </td>
                <td className="px-6 py-4 font-semibold">${result.totalLandedCost.toFixed(2)}</td>
              </tr>
            ))}
            {results.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-muted-foreground">
                  {status === "processing"
                    ? "Loading offers..."
                    : status === "partial_error"
                      ? "No offer rows were returned. Check source diagnostics below."
                      : "Run a comparison to see offers."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {sourceDiagnostics.length > 0 && (
        <div className="mt-8 rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Source Diagnostics</h2>
              <p className="text-sm text-muted-foreground">
                {updatedAt ? `Last update: ${new Date(updatedAt).toLocaleTimeString()}` : "Waiting for updates..."}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Badge variant="outline">Success: {diagnosticSummary.success}</Badge>
              <Badge variant="outline">Pending: {diagnosticSummary.pending}</Badge>
              <Badge variant="outline">Timeout: {diagnosticSummary.timeout}</Badge>
              <Badge variant="outline">Error: {diagnosticSummary.error}</Badge>
            </div>
          </div>

          <div className="space-y-2">
            {sourceDiagnostics.map((diag) => (
              <div
                key={diag.source}
                className="flex flex-col gap-2 rounded-lg border border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium capitalize">{formatSourceName(diag.source)}</span>
                  {diag.state === "success" && (
                    <Badge className="bg-emerald-600 text-white">
                      <CheckCircle2 className="h-3 w-3" /> success
                    </Badge>
                  )}
                  {diag.state === "pending" && (
                    <Badge className="bg-amber-500 text-white">
                      <Loader2 className="h-3 w-3 animate-spin" /> pending
                    </Badge>
                  )}
                  {diag.state === "timeout" && (
                    <Badge className="bg-orange-600 text-white">
                      <Clock3 className="h-3 w-3" /> timeout
                    </Badge>
                  )}
                  {diag.state === "error" && (
                    <Badge variant="destructive">
                      <TriangleAlert className="h-3 w-3" /> error
                    </Badge>
                  )}
                </div>

                <div className="text-sm text-muted-foreground">
                  {diag.latencyMs !== undefined ? `${diag.latencyMs} ms` : "Pending"}
                </div>

                {diag.error && <div className="text-xs text-muted-foreground sm:max-w-[560px]">{diag.error}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
