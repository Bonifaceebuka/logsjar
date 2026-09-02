"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Page() {
  // Derived/extra data for new sections (kept client-side for now)
  const health = [
    { name: "Ingest Service", status: "healthy" },
    { name: "Alerting Service", status: "healthy" },
    { name: "Database", status: "healthy" },
    { name: "Public API", status: "healthy" },
  ];

  const [logsData, setLogsData] = React.useState<any>(null);

  // Calculate dynamic metrics
  const { errorRate, lineData, errorTrendData, topActivity, topSources } =
    React.useMemo(() => {
      if (!logsData?.logs) {
        return {
          errorRate: "0%",
          lineData: [],
          errorTrendData: [],
          topActivity: [],
          topSources: [],
        };
      }

      const logs = logsData.logs as any[];
      const total = logs.length;
      const errorCount = logs.filter((l) => l.type === "error").length;
      const rate = total > 0 ? ((errorCount / total) * 100).toFixed(1) : "0.0";

      // Prepare 12h buckets
      const now = new Date();
      const buckets = Array.from({ length: 12 }).map((_, i) => {
        const d = new Date(now.getTime() - (11 - i) * 60 * 60 * 1000);
        const h = d.getHours();
        const nextH = (h + 1) % 24;

        const getPart = (hour: number) => {
          const ampm = hour >= 12 ? "PM" : "AM";
          const h12 = hour % 12 || 12;
          return { h12, ampm };
        };

        const start = getPart(h);
        const end = getPart(nextH);

        let label;
        if (start.ampm === end.ampm) {
          label = `${start.h12}-${end.h12} ${start.ampm}`;
        } else {
          label = `${start.h12} ${start.ampm} - ${end.h12} ${end.ampm}`;
        }

        return {
          hour: d.getHours(),
          label,
          logs: 0,
          errors: 0,
        };
      });

      // Fill buckets
      logs.forEach((log) => {
        const dateStr = log.ingested_at?.replace(" ", "T") + "Z";
        const date = dateStr ? new Date(dateStr) : new Date();

        const hour = date.getHours();
        const bucket = buckets.find((b) => b.hour === hour);
        if (bucket) {
          bucket.logs++;
          if (log.type === "error") {
            bucket.errors++;
          }
        }
      });

      // Calculate Top Sources
      const sourceCounts: Record<string, number> = {};
      logs.forEach((log) => {
        const s = log.service;
        if (s) {
          sourceCounts[s] = (sourceCounts[s] || 0) + 1;
        }
      });

      const topSources = Object.entries(sourceCounts)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        errorRate: `${rate}%`,
        lineData: buckets.map((b) => ({ hour: b.label, logs: b.logs })),
        errorTrendData: buckets.map((b) => ({
          hour: b.label,
          errors: b.errors,
        })),
        topActivity: logs.slice(0, 5).map((log) => {
          const dateStr = log.ingested_at?.replace(" ", "T") + "Z";
          const date = dateStr ? new Date(dateStr) : new Date();
          const time = date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });

          let status = "ok";
          if (log.type === "error") status = "error";
          else if (log.type === "warn") status = "warn";

          return {
            time,
            source: log.subsystem || log.appName || "unknown",
            action: log.operation || log.message || "-",
            status,
          };
        }),
        topSources,
      };
    }, [logsData]);

  // Live metrics state (ingestRate and backlog from SSE)
  const [metrics, setMetrics] = React.useState<{
    ingestRate: number;
    backlog: number;
    avgLatency: number;
  } | null>(null);

  // Format ingest rate as e.g. "2.3k/s" or "980/s"
  const fmtRate = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k/s` : `${n}/s`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          High‑level metrics and activity across your logs and alerts.
        </p>
      </div>

      {/* Row 1 — Metrics cards (6 compact) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          {
            label: "Logs (24h)",
            value: logsData?.totalCount ?? 0,
          },
          { label: "Error Rate", value: errorRate },
          {
            label: "Ingest Rate",
            value: metrics ? fmtRate(metrics.ingestRate) : "—",
            live: true,
          },
          { label: "Active Alerts", value: "0" },
          {
            label: "Avg Latency",
            value: metrics ? `${metrics.avgLatency}ms` : "—",
            live: true,
          },
          {
            label: "Queue Backlog",
            value: metrics ? `${metrics.backlog} jobs` : "—",
            live: true,
          },
        ].map((s) => (
          <Card key={s.label} className="rounded-xl">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs text-muted-foreground flex items-center justify-between">
                {s.label}
                {s.live && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Live</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Row 2 — 3 wide charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm">Logs Over Time (12h)</CardTitle>
          </CardHeader>
          <CardContent className="h-70">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineData}
                margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
              >
                <XAxis dataKey="hour" hide />
                <YAxis hide />
                <RTooltip
                  contentStyle={{ borderRadius: 12 }}
                  labelStyle={{ color: "#00C2A8" }}
                />
                <Line
                  type="monotone"
                  dataKey="logs"
                  stroke="#00C2A8"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm">Error Trend (12h)</CardTitle>
          </CardHeader>
          <CardContent className="h-70">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={errorTrendData}
                margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
              >
                <XAxis dataKey="hour" hide />
                <YAxis hide />
                <RTooltip
                  contentStyle={{ borderRadius: 12 }}
                  labelStyle={{ color: "#ef4444" }}
                />
                <Area
                  type="monotone"
                  dataKey="errors"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.2}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm">Top Sources (24h)</CardTitle>
          </CardHeader>
          <CardContent className="h-70">
            {topSources.length > 0 ? (
              <div className="h-full flex items-center justify-center">
                <div
                  style={{
                    width:
                      topSources.length <= 3
                        ? `${topSources.length * 120}px`
                        : "100%",
                    maxWidth: "100%",
                    height: "100%",
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topSources}
                      margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
                    >
                      <XAxis dataKey="source" />
                      <YAxis />
                      <RTooltip
                        contentStyle={{ borderRadius: 12 }}
                        cursor={{ fill: "transparent" }}
                      />
                      <Bar
                        dataKey="count"
                        fill="#00C2A8"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Enough data not available yet!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 3 — 2 uneven cards (65/35 split) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left (65%) — Top Activity table */}
        <Card className="rounded-2xl xl:col-span-8">
          <CardHeader>
            <CardTitle className="text-sm">Top Activity (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topActivity.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>{row.time}</TableCell>
                    <TableCell className="capitalize">{row.source}</TableCell>
                    <TableCell>{row.action}</TableCell>
                    <TableCell>
                      <span
                        className={
                          row.status === "ok"
                            ? "text-green-500"
                            : row.status === "warn"
                              ? "text-yellow-500"
                              : "text-red-500"
                        }
                      >
                        {row.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}

                {topActivity.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 flex items-center justify-center"
                    >
                      <div className="text-sm text-muted-foreground">
                        Enough data not available yet!
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Right (35%) — Stacked panels: Health + Alerts */}
        <div className="flex flex-col gap-6 xl:col-span-4">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-sm">System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {health.map((h) => (
                <div key={h.name} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {h.name}
                  </span>
                  <div className="flex items-center gap-2">
                    {h.status === "healthy" ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 duration-1000"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Live</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span
                        className={
                          "inline-block h-2 w-2 rounded-full " +
                          (h.status === "degraded"
                            ? "bg-yellow-500"
                            : "bg-red-500")
                        }
                      />
                    )}
                    <span className="text-sm capitalize">{h.status}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-sm">Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Enough data not available yet!
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
