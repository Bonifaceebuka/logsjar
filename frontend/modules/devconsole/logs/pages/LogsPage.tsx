"use client";

import React from "react";
import LogsPageTable from "../components/LogsPageTable";
import LogsPageDrawer from "../components/LogsPageDrawer";
import LogsPageFooter from "../components/LogsPageFooter";
import LogsPageQueryFilter from "../components/LogsPageQueryFilter";
import { Search, Loader2 } from "lucide-react";
import { useGetLogs } from "../../live-logs/api/live-logs.api.";

type ResultRow = {
  timestamp?: string;
  level?: "error" | "warning" | "warn" | "info" | "audit" | "metric" | "debug";
  type?: "error" | "warning" | "info" | "audit" | "metric";
  appName?: string;
  message?: string;
  environment?: string;
  importance?: number | string | null;
  subsystem?: string | null;
  operation?: string | null;
  [key: string]: any;
};

export const levelColor: Record<string, string> = {
  info: "#60A5FA",
  warn: "#FBBF24",
  error: "#F87171",
  fatal: "#F87171",
  debug: "#A78BFA",
};

export default function LogsPage() {
  const [filters, setFilters] = React.useState<any>({});
  const [selected, setSelected] = React.useState<ResultRow | null>(null);

  const { data, isLoading, error } = useGetLogs();

  /**
   * API response is now the source of truth.
   */
  const logs: ResultRow[] = data ?? [];

  /**
   * Apply the query filters to the API data.
   */
  const results = React.useMemo(() => {
    const rows = logs.filter((row) => {
      const rowLevel = String(
        row.level ?? row.type ?? ""
      ).toLowerCase();

      const matchesType = filters.level
        ? rowLevel === String(filters.level).toLowerCase()
        : true;

      const matchesEnv = filters.env
        ? String(row.environment ?? "").toLowerCase() ===
          String(filters.env).toLowerCase()
        : true;

      const matchesApp = filters.appName
        ? String(row.appName ?? "").toLowerCase() ===
          String(filters.appName).toLowerCase()
        : true;

      const matchesSearch = filters.search
        ? `${row.message ?? ""} ${JSON.stringify(row)}`
            .toLowerCase()
            .includes(String(filters.search).toLowerCase())
        : true;

      return (
        matchesType &&
        matchesEnv &&
        matchesApp &&
        matchesSearch
      );
    });

    /**
     * Respect the requested limit.
     */
    const limit = filters.limit ?? rows.length;

    return rows.slice(0, Number(limit));
  }, [logs, filters]);

  /**
   * Calculate statistics from the filtered results.
   */
  const stats = React.useMemo(() => {
    const total = results.length;

    const errors = results.filter((row) => {
      const level = String(
        row.level ?? row.type ?? ""
      ).toLowerCase();

      return level === "error";
    }).length;

    const warnings = results.filter((row) => {
      const level = String(
        row.level ?? row.type ?? ""
      ).toLowerCase();

      return level === "warn";
    }).length;

    return {
      total,
      errors,
      warnings,
    };
  }, [results]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Queries
        </h1>

        <p className="text-sm text-muted-foreground">
          Search, filter, and analyze logs stored in your project.
        </p>
      </div>

      {/* Query Bar */}
      <LogsPageQueryFilter
        setFilters={setFilters}
      />

      {/* Results Table */}
      <div className="rounded-xl border">
        <div className="flex items-center justify-between px-3 py-2">
          <h3 className="text-sm font-medium">
            Query Results
          </h3>

          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            {isLoading && (
              <Loader2 className="h-3 w-3 animate-spin" />
            )}

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

      {/* Footer */}
      <LogsPageFooter
        isLoading={isLoading}
        stats={stats}
      />
    </div>
  );
}