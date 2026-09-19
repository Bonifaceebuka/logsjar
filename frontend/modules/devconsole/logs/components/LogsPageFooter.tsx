import React from 'react'

export default function LogsPageFooter({
    isLoading,
    stats
}:{
    isLoading: boolean,
    stats: any
}) {
  return (
    <div
        className="flex items-center justify-between rounded-xl border px-3 py-2 text-xs"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="flex items-center gap-6">
          <span className="text-muted-foreground">Results</span>
          <span className="font-medium">{stats.total.toLocaleString()}</span>
          <span className="text-muted-foreground">Errors</span>
          <span className="font-medium">{stats.errors.toLocaleString()}</span>
          <span className="text-muted-foreground">Warnings</span>
          <span className="font-medium">{stats.warnings.toLocaleString()}</span>
        </div>
        <div className="text-muted-foreground">
          {isLoading ? "Loading…" : ""}
        </div>
      </div>
  )
}
