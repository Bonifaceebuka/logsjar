"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Activity as ActivityIcon, Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// type definitions and helpers (added)
type LogLevel =
  | "info"
  | "warning"
  | "error"
  | "debug"
  | "success"
  | "audit"
  | "metric";
// Allow dynamic sources from stream (e.g., appName like "default")
type LogSource = string;

type LogEntry = {
  id: string;
  ts: string;
  level: LogLevel;
  source: LogSource;
  message: string;
  payload: Record<string, unknown>;
};

const STATIC_LOG_TAIL: LogEntry[] = [
  {
    id: "log-001",
    ts: "2026-06-14T09:42:11.000Z",
    level: "info",
    source: "web",
    message: "GET /api/projects returned 200 in 148ms",
    payload: {
      method: "GET",
      route: "/api/projects",
      status: 200,
      durationMs: 148,
      requestId: "req_7x2k91",
    },
  },
  {
    id: "log-002",
    ts: "2026-06-14T09:42:18.000Z",
    level: "debug",
    source: "worker",
    message: "Cache warmup skipped because latest snapshot is still fresh",
    payload: {
      cacheKey: "dashboard:summary",
      ageSeconds: 47,
      thresholdSeconds: 60,
    },
  },
  {
    id: "log-003",
    ts: "2026-06-14T09:42:24.000Z",
    level: "warning",
    source: "api",
    message: "Stripe webhook retry scheduled after signature verification timeout",
    payload: {
      event: "invoice.payment_succeeded",
      retryInSeconds: 30,
      requestId: "wh_29af8d",
    },
  },
  {
    id: "log-004",
    ts: "2026-06-14T09:42:31.000Z",
    level: "success",
    source: "jobs",
    message: "Nightly usage aggregation completed successfully",
    payload: {
      processedAccounts: 182,
      durationMs: 3128,
      batchId: "batch_20260614",
    },
  },
  {
    id: "log-005",
    ts: "2026-06-14T09:42:37.000Z",
    level: "audit",
    source: "auth",
    message: "Admin user updated workspace billing settings",
    payload: {
      actorId: "usr_admin_01",
      workspaceId: "ws_9h31x",
      action: "billing.settings.update",
    },
  },
  {
    id: "log-006",
    ts: "2026-06-14T09:42:44.000Z",
    level: "metric",
    source: "ingest",
    message: "Log ingestion throughput sampled at 284 events/sec",
    payload: {
      eventsPerSecond: 284,
      region: "sin1",
      queueDepth: 12,
    },
  },
  {
    id: "log-007",
    ts: "2026-06-14T09:42:51.000Z",
    level: "error",
    source: "api",
    message: "POST /api/logs failed with 500 due to upstream timeout",
    payload: {
      method: "POST",
      route: "/api/logs",
      status: 500,
      durationMs: 10021,
      upstream: "events-service",
    },
  },
  {
    id: "log-008",
    ts: "2026-06-14T09:42:59.000Z",
    level: "info",
    source: "frontend",
    message: "User opened the live logs dashboard",
    payload: {
      userId: "usr_52plq",
      workspaceId: "ws_9h31x",
      pathname: "/live-logs",
    },
  },
  {
    id: "log-009",
    ts: "2026-06-14T09:43:05.000Z",
    level: "warning",
    source: "cdn",
    message: "Asset miss rate exceeded warning threshold for /dashboard bundle",
    payload: {
      asset: "/_next/static/chunks/dashboard.js",
      missRate: 0.13,
      threshold: 0.1,
    },
  },
  {
    id: "log-010",
    ts: "2026-06-14T09:43:13.000Z",
    level: "success",
    source: "deploy",
    message: "Main dashboard deployed to production",
    payload: {
      commit: "3f19b7a",
      environment: "production",
      durationMs: 84211,
    },
  },
];

const LIVE_LOG_TEMPLATES: Omit<LogEntry, "id" | "ts">[] = [
  {
    level: "info",
    source: "web",
    message: "GET /api/session returned 200 in 54ms",
    payload: {
      method: "GET",
      route: "/api/session",
      status: 200,
      durationMs: 54,
    },
  },
  {
    level: "debug",
    source: "worker",
    message: "Processing background sync job",
    payload: {
      queue: "sync",
      attempt: 1,
      workerId: "worker-3",
    },
  },
  {
    level: "warning",
    source: "cdn",
    message: "Cache miss spike detected for dashboard assets",
    payload: {
      assetGroup: "dashboard",
      missRate: 0.12,
    },
  },
  {
    level: "error",
    source: "api",
    message: "POST /api/logs failed with upstream timeout",
    payload: {
      method: "POST",
      route: "/api/logs",
      status: 500,
      upstream: "events-service",
    },
  },
  {
    level: "success",
    source: "jobs",
    message: "Usage aggregation batch completed",
    payload: {
      batch: "usage-rollup",
      processed: 42,
    },
  },
];

// Color scheme mapping (matches your spec)
const levelColor: Record<LogLevel, string> = {
  info: "#60A5FA", // Blue
  warning: "#FBBF24", // Yellow/Amber
  error: "#F87171", // Red
  debug: "#A78BFA", // Purple
  success: "#34D399", // Emerald/Green
  audit: "#34D399", // Emerald/Green
  metric: "#22D3EE", // Cyan
};

function buildLiveLog(index: number): LogEntry {
  const template = LIVE_LOG_TEMPLATES[index % LIVE_LOG_TEMPLATES.length];

  return {
    id: `live-log-${index}-${Date.now()}`,
    ts: new Date().toISOString(),
    level: template.level,
    source: template.source,
    message: template.message,
    payload: {
      ...template.payload,
      tick: index + 1,
    },
  };
}

export default function LiveLogsPage() {
  const [logs, setLogs] = React.useState<LogEntry[]>(STATIC_LOG_TAIL);
  const [filterLevel, setFilterLevel] = React.useState<"All" | LogLevel>("All");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<LogEntry | null>(null);
  const streamRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let tick = 0;

    const interval = window.setInterval(() => {
      setLogs((currentLogs) => {
        const nextLog = buildLiveLog(tick);
        tick += 1;
        return [...currentLogs, nextLog];
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  React.useEffect(() => {
    streamRef.current?.scrollTo({ top: streamRef.current.scrollHeight });
  }, [logs.length]);

  const filteredLogs: LogEntry[] = React.useMemo(() => {
    return logs.filter((l) => {
      const byLevel = filterLevel === "All" ? true : l.level === filterLevel;
      const bySearch =
        search.trim().length === 0
          ? true
          : `${l.message} ${JSON.stringify(l.payload)}`
              .toLowerCase()
              .includes(search.toLowerCase());
      return byLevel && bySearch;
    });
  }, [logs, filterLevel, search]);

  const stats = React.useMemo(() => {
    const total = filteredLogs.length;
    let errors = 0;
    let warnings = 0;
    let success = 0;
    for (const l of filteredLogs) {
      if (l.level === "error") errors++;
      else if (l.level === "warning") warnings++;
      else if (l.level === "success") success++;
    }
    return { total, errors, warnings, success };
  }, [filteredLogs]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Log Tail</h1>
          <p className="text-sm text-muted-foreground">
            Watch new log lines arrive every second.
          </p>
        </div>
      </div>

      {/* Filters Row (horizontal) */}
      <div className="flex items-end gap-3">
        <div className="w-55">
          <div className="text-xs text-muted-foreground mb-1">Category</div>
          <Select
            value={filterLevel}
            onValueChange={(v) =>
              setFilterLevel(v === "All" ? "All" : (v as LogLevel))
            }
          >
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="debug">Debug</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="audit">Audit</SelectItem>
              <SelectItem value="metric">Metric</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <div className="text-xs text-muted-foreground mb-1">Search</div>
          <Input
            placeholder="Search logs (e.g. message: timeout)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl"
          />
        </div>
      </div>

      {/* Log Viewer */}
      <div className="space-y-2">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ActivityIcon className="h-4 w-4 opacity-60" />
            <span className="text-xs text-muted-foreground">
              Live tail • {logs.length} entries
            </span>
          </div>
          <span className="text-xs text-muted-foreground">Updates every second</span>
        </div>

        <div
          ref={streamRef}
          className="h-[60vh] w-full overflow-y-auto rounded-xl border"
          style={{
            border: "1px solid rgba(255,255,255,0.05)",
            background: "#0B0F13",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "13px",
            lineHeight: "1.6",
          }}
        >
          {filteredLogs.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <ActivityIcon className="mr-2 h-4 w-4" />
              No matching logs in the static tail.
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {filteredLogs.map((l) => (
                <li
                  key={l.id}
                  className="group px-3 py-2 cursor-pointer hover:bg-white/2 transition-colors"
                  onClick={() => setSelected(l)}
                >
                  <span className="text-[11px] text-white/50 mr-2">
                    {new Date(l.ts).toLocaleTimeString()}
                  </span>
                  <span
                    className="mr-2 font-medium"
                    style={{ color: levelColor[l.level] }}
                  >
                    [{l.level.toUpperCase()}]
                  </span>
                  <span className="mr-2 text-white/70">{l.source}</span>
                  <span className="block text-white/90 whitespace-nowrap overflow-hidden text-ellipsis group-hover:whitespace-normal group-hover:wrap-break-word">
                    {l.message}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-105 rounded-xl border bg-background p-4"
            style={{ background: "#0E1117" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Log Details</h3>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl hover:bg-white/2"
                onClick={() => {
                  navigator.clipboard.writeText(
                    JSON.stringify(selected, null, 2),
                  );
                }}
              >
                <Clipboard className="mr-2 h-3.5 w-3.5" />
                Copy JSON
              </Button>
            </div>
            <Tabs defaultValue="formatted" className="mt-3">
              <TabsList>
                <TabsTrigger value="formatted">Formatted</TabsTrigger>
                <TabsTrigger value="raw">Raw JSON</TabsTrigger>
              </TabsList>
              <TabsContent value="formatted" className="mt-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Timestamp</span>
                    <span>{new Date(selected.ts).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Level</span>
                    <span
                      className="font-medium"
                      style={{ color: levelColor[selected.level] }}
                    >
                      {selected.level}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Source</span>
                    <span>{selected.source}</span>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Message</div>
                    <div className="rounded-lg border border-white/10 bg-black/20 p-2">
                      {selected.message}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Payload</div>
                    <pre className="rounded-lg border border-white/10 bg-black/20 p-2 overflow-x-auto text-xs">
                      {JSON.stringify(selected.payload, null, 2)}
                    </pre>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="raw" className="mt-3">
                <pre className="rounded-lg border border-white/10 bg-black/20 p-2 overflow-x-auto text-xs">
                  {JSON.stringify(selected, null, 2)}
                </pre>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      <div
        className="flex items-center justify-between rounded-xl border px-3 py-2 text-xs"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="flex items-center gap-6">
          <span className="text-muted-foreground">Logs Loaded</span>
          <span className="font-medium">{stats.total.toLocaleString()}</span>
          <span className="text-muted-foreground">Errors</span>
          <span className="font-medium">{stats.errors}</span>
          <span className="text-muted-foreground">Warnings</span>
          <span className="font-medium">{stats.warnings}</span>
        </div>
      </div>
    </div>
  );
}
