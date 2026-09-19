"use client";
import React from "react";
import { Input } from "@/common/components/ui/input";
import { Button } from "@/common/components/ui/button";
import { Play, XCircle, Search, Clipboard, Loader2 } from "lucide-react";
import LogsPageTable from "../components/LogsPageTable";
import LogsPageDrawer from "../components/LogsPageDrawer";
import LogsPageFooter from "../components/LogsPageFooter";

type ResultRow = {
  timestamp?: string;
  type?: "error" | "warning" | "info" | "audit" | "metric";
  appName?: string;
  message?: string;
  environment?: string;
  importance?: number | string | null;
  subsystem?: string | null;
  operation?: string | null;
  [key: string]: any;
};

const STATIC_QUERY_RESULTS: ResultRow[] = [
  {
    timestamp: "2026-06-14T09:42:11.000Z",
    type: "info",
    appName: "web",
    message: "GET /api/projects returned 200 in 148ms",
    environment: "production",
    importance: 2,
    subsystem: "http",
    operation: "GET /api/projects",
  },
  {
    timestamp: "2026-06-14T09:42:18.000Z",
    type: "warning",
    appName: "billing",
    message: "Stripe webhook retry scheduled after timeout",
    environment: "production",
    importance: 3,
    subsystem: "payments",
    operation: "webhook.retry",
  },
  {
    timestamp: "2026-06-14T09:42:24.000Z",
    type: "error",
    appName: "api",
    message: "POST /api/logs failed with upstream timeout",
    environment: "production",
    importance: 5,
    subsystem: "ingest",
    operation: "POST /api/logs",
  },
  {
    timestamp: "2026-06-14T09:42:31.000Z",
    type: "audit",
    appName: "auth",
    message: "Admin user updated workspace billing settings",
    environment: "production",
    importance: 4,
    subsystem: "rbac",
    operation: "billing.settings.update",
  },
  {
    timestamp: "2026-06-14T09:42:37.000Z",
    type: "metric",
    appName: "ingest",
    message: "Log ingestion throughput sampled at 284 events/sec",
    environment: "production",
    importance: 1,
    subsystem: "pipeline",
    operation: "throughput.sample",
  },
  {
    timestamp: "2026-06-14T09:42:44.000Z",
    type: "warning",
    appName: "billing",
    message: "Invoice export latency exceeded warning threshold",
    environment: "staging",
    importance: 3,
    subsystem: "exports",
    operation: "invoice.export",
  },
  {
    timestamp: "2026-06-14T09:42:51.000Z",
    type: "error",
    appName: "api",
    message: "Query execution timeout while reading logs",
    environment: "development",
    importance: 5,
    subsystem: "queries",
    operation: "logs.query",
  },
  {
    timestamp: "2026-06-14T09:42:59.000Z",
    type: "info",
    appName: "dashboard",
    message: "User opened the queries page",
    environment: "production",
    importance: 1,
    subsystem: "ui",
    operation: "page.view",
  },
  {
    timestamp: "2026-06-14T09:43:05.000Z",
    type: "error",
    appName: "billing",
    message: "Payment sync failed after upstream timeout",
    environment: "production",
    importance: 5,
    subsystem: "sync",
    operation: "payment.sync",
  },
  {
    timestamp: "2026-06-14T09:43:13.000Z",
    type: "info",
    appName: "api",
    message: "Scheduled cleanup job completed successfully",
    environment: "production",
    importance: 2,
    subsystem: "jobs",
    operation: "cleanup.run",
  },
];

  export const levelColor: Record<string, string> = {
    info: "#60A5FA",      // Blue
    warning: "#FBBF24",      // Yellow/Amber
    error: "#F87171",     // Red
    debug: "#A78BFA",     // Purple
    success: "#34D399",   // Emerald/Green
    audit: "#34D399",     // Emerald/Green
    metric: "#22D3EE",    // Cyan
  };
export default function LogsPage() {
    const [filters, setFilters] = React.useState<{
    limit?: number;
    query?: string; // kept for compatibility, but we’ll send explicit keys
    type?: string;
    env?: string;
    appName?: string;
    search?: string;
  }>({});
  const isLoading = false;
  const error = null;

  const [query, setQuery] = React.useState("");

  // Use examples that map cleanly to server filters
  const examples = [
    "type:error",
    "appName:api AND search:timeout",
    "type:warning AND appName:billing",
  ];

  // Normalize UI query tokens to server-supported filters
  const normalizeQuery = (q: string) =>
    q
      .replace(/\blevel:/gi, "type:")
      .replace(/\bservice:/gi, "appName:")
      .replace(/\bmessage:/gi, "search:")
      .trim();

  // Parse "type:error AND appName:api AND search:timeout env:development" → explicit filters
  const parseQueryFilters = React.useCallback((q: string) => {
    const out: {
      type?: string;
      env?: string;
      appName?: string;
      search?: string;
    } = {};
    const parts = q.trim().split(/\s+AND\s+|\s+/i);
    for (const p of parts) {
      const [rawKey, ...rest] = p.split(":");
      if (!rawKey || rest.length === 0) continue;
      const value = rest.join(":").trim();
      const key = rawKey.trim().toLowerCase();
      // map synonyms to server-supported keys
      const mapped =
        key === "level"
          ? "type"
          : key === "service"
            ? "appName"
            : key === "message"
              ? "search"
              : key;

      if (mapped === "type") out.type = value;
      else if (mapped === "env" || mapped === "environment") out.env = value;
      else if (mapped === "appName" || mapped === "app") out.appName = value;
      else if (mapped === "search") out.search = value;
    }
    return out;
  }, []);

  const results: ResultRow[] = React.useMemo(() => {
    const rows = STATIC_QUERY_RESULTS.filter((row) => {
      const matchesType = filters.type
        ? String(row.type || "").toLowerCase() === filters.type.toLowerCase()
        : true;
      const matchesEnv = filters.env
        ? String(row.environment || "").toLowerCase() ===
          filters.env.toLowerCase()
        : true;
      const matchesApp = filters.appName
        ? String(row.appName || "").toLowerCase() ===
          filters.appName.toLowerCase()
        : true;
      const matchesSearch = filters.search
        ? `${row.message ?? ""} ${JSON.stringify(row)}`
            .toLowerCase()
            .includes(filters.search.toLowerCase())
        : true;

      return matchesType && matchesEnv && matchesApp && matchesSearch;
    });

    const limit = filters.limit ?? rows.length;
    return rows.slice(0, limit);
  }, [filters]);
  const [selected, setSelected] = React.useState<ResultRow | null>(null);

  const runQuery = () => {
    const parsed = parseQueryFilters(normalizeQuery(query));
    setFilters((prev) => ({
      ...prev,
      ...parsed, // send explicit keys: type, env, appName, search
      limit: 200,
    }));
  };

  const clearQuery = () => {
    setQuery("");
    setFilters({ limit: 100 });
  };

  const stats = React.useMemo(() => {
    const total = results.length;
    const errors = results.filter(
      (r) => String(r.type || "").toLowerCase() === "error"
    ).length;
    const warnings = results.filter((r) => {
      const t = String(r.type || "").toLowerCase();
      return t === "warning" || t === "warn";
    }).length;
    return { total, errors, warnings };
  }, [results]);

   return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Queries</h1>
        <p className="text-sm text-muted-foreground">
          Search, filter, and analyze logs stored in your project.
        </p>
      </div>

      {/* Query Bar */}
      <div className="rounded-xl border p-3">
        <div className="flex gap-3">
          <Input
            placeholder="Enter query (e.g. type:error AND appName:billing)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") runQuery();
            }}
            className="rounded-xl flex-1"
          />
          <Button onClick={runQuery} className="rounded-xl">
            <Play className="h-4 w-4" />
            Run Query
          </Button>
          <Button
            variant="ghost"
            onClick={clearQuery}
            className="rounded-xl hover:bg-white/[0.02]"
          >
            <XCircle className="h-4 w-4" />
            Clear
          </Button>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Search className="h-4 w-4 opacity-60" />
          <div className="text-xs text-muted-foreground">Examples:</div>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => setQuery(ex)}
                className="text-xs rounded-full border px-2 py-1 text-muted-foreground hover:bg-white/[0.03]"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="rounded-xl border">
        <div className="flex items-center justify-between px-3 py-2">
          <h3 className="text-sm font-medium">Query Results</h3>
          <span className="text-xs text-muted-foreground flex items-center gap-2">
            {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
            {stats.total} rows
          </span>
        </div>
        <div
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "13px",
          }}
        >
          {error ? (
            <div className="flex items-center justify-center py-12 text-red-400">
              Failed to load logs: {String(error)}
            </div>
          ) : results.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Search className="mr-2 h-4 w-4" />
              No logs found. Try adjusting your query.
            </div>
          ) : (
            <LogsPageTable 
                results={results}
                setSelected={setSelected}
            />
          )}
        </div>
      </div>

      {/* Drawer: Log Details */}
      {selected && (
        <LogsPageDrawer 
            setSelected={setSelected}
            selected={selected}
        />
      )}

      {/* Footer status bar */}
      <LogsPageFooter 
        isLoading={isLoading}
        stats={stats}
      />
    </div>
  );
}
