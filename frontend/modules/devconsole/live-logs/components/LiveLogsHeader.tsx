export default function LiveLogsHeader() {
  return (
    <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Log Tail</h1>
          <p className="text-sm text-muted-foreground">
            Watch new log lines arrive every second.
          </p>
        </div>
      </div>
  )
}
