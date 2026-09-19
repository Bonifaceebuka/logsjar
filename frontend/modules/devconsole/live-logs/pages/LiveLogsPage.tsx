"use client";

import React from "react";
import { Activity as ActivityIcon } from "lucide-react";
import PageLoader from "@/common/components/PageLoader";
import { useGetLogs } from "@/modules/devconsole/live-logs/api/live-logs.api.";
import LiveLogsHeader from "../components/LiveLogsHeader";
import LiveLogsFilter from "../components/LiveLogsFilter";
import { LogLevel } from "@logsjar/shared";
import LiveLogs from "../components/LiveLogs";

type LogSource = string;

type LogEntry = {
    id: string;
    created_at: string;
    level: LogLevel;
    source: LogSource;
    message: string;
    payload: Record<string, unknown>;
};

export default function LiveLogsPage() {
    const [filterLevel, setFilterLevel] = React.useState<"All" | LogLevel>("All");
    const [search, setSearch] = React.useState("");
    const [selected, setSelected] = React.useState<LogEntry | null>(null);

    const streamRef = React.useRef<HTMLDivElement>(null);

    const { data, isLoading } = useGetLogs();

    /**
     * Adjust this depending on the exact shape returned by useGetLogs().
     *
     * If data itself is the array:
     */
    const logs: LogEntry[] = data ?? [];

    const filteredLogs = React.useMemo(() => {
        return logs.filter((log) => {
            const byLevel =
                filterLevel === "All" || log.level === filterLevel;

            const bySearch =
                search.trim().length === 0
                    ? true
                    : `${log.message} ${JSON.stringify(log.payload)}`
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

        for (const log of filteredLogs) {
            if (log.level === "error") {
                errors++;
            } else if (log.level === "warn") {
                warnings++;
            } else if (log.level === "info") {
                success++;
            }
        }

        return {
            total,
            errors,
            warnings,
            success,
        };
    }, [filteredLogs]);

    React.useEffect(() => {
        streamRef.current?.scrollTo({
            top: streamRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [filteredLogs.length]);

    if (isLoading) {
        return <PageLoader />;
    }
    return (
        <div className="space-y-4">
            <LiveLogsHeader />

            <LiveLogsFilter
                filterLevel={filterLevel}
                setFilterLevel={setFilterLevel}
                search={search}
                setSearch={setSearch}
            />

            <div className="space-y-2">
                <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ActivityIcon className="h-4 w-4 opacity-60" />

                        <span className="text-xs text-muted-foreground">
                            Live tail • {logs.length} entries
                        </span>
                    </div>

                    <span className="text-xs text-muted-foreground">
                        API logs
                    </span>
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
                            No matching logs.
                        </div>
                    ) : (
                        <LiveLogs
                            filteredLogs={filteredLogs}
                            setSelected={setSelected}
                        />
                    )}
                </div>
            </div>

            <div
                className="flex items-center justify-between rounded-xl border px-3 py-2 text-xs"
                style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                }}
            >
                <div className="flex items-center gap-6">
                    <span className="text-muted-foreground">
                        Logs Loaded
                    </span>

                    <span className="font-medium">
                        {stats.total.toLocaleString()}
                    </span>

                    <span className="text-muted-foreground">
                        Errors
                    </span>

                    <span className="font-medium">
                        {stats.errors}
                    </span>

                    <span className="text-muted-foreground">
                        Warnings
                    </span>

                    <span className="font-medium">
                        {stats.warnings}
                    </span>
                </div>
            </div>
        </div>
    );
}