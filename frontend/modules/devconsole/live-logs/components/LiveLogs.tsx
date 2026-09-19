"use client"

const levelColor: Record<string, string> = {
    info: "#60A5FA",
    warn: "#FBBF24",
    error: "#F87171",
    debug: "#A78BFA",
    success: "#34D399",
    audit: "#34D399",
    metric: "#22D3EE",
};

export default function LiveLogs({
    filteredLogs,
    setSelected
}: {
    filteredLogs: any,
    setSelected: any
}) {
    return (
        <ul className="divide-y divide-white/5">
            {filteredLogs.map((log: any) => (
                <li
                    key={log.id}
                    className="group cursor-pointer px-3 py-2 transition-colors hover:bg-white/2"
                    onClick={() => setSelected(log)}
                >
                    <span className="mr-2 text-[11px] text-white/50">
                        {new Date(log.created_at).toLocaleTimeString()}
                    </span>

                    <span
                        className="mr-2 font-medium"
                        style={{
                            color: levelColor[log.level] ?? "#FFFFFF",
                        }}
                    >
                        [{log.level.toUpperCase()}]
                    </span>

                    <span className="mr-2 text-white/70">
                        {log.source}
                    </span>

                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-white/90 group-hover:whitespace-normal group-hover:wrap-break-word">
                        {log.message}
                    </span>
                </li>
            ))}
        </ul>
    )
}
