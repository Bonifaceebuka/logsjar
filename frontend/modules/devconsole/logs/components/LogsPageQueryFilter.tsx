import { Input } from "@/common/components/ui/input";
import { Button } from "@/common/components/ui/button";
import { Play, XCircle, Search} from "lucide-react";
import { useCallback, useState } from "react";

export default function LogsPageQueryFilter({
    setFilters
}: { setFilters: any}) {
    
  // Use examples that map cleanly to server filters
  const examples = [
    "type:error",
    "appName:api AND search:timeout",
    "type:warning AND appName:billing",
  ];

    const [query, setQuery] = useState("");

  // Normalize UI query tokens to server-supported filters
  const normalizeQuery = (q: string) =>
    q
      .replace(/\blevel:/gi, "type:")
      .replace(/\bservice:/gi, "appName:")
      .replace(/\bmessage:/gi, "search:")
      .trim();

  // Parse "type:error AND appName:api AND search:timeout env:development" → explicit filters
  const parseQueryFilters = useCallback((q: string) => {
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

   const runQuery = () => {
    const parsed = parseQueryFilters(normalizeQuery(query));
    setFilters((prev: any) => ({
      ...prev,
      ...parsed, // send explicit keys: type, env, appName, search
      limit: 200,
    }));
  };

  const clearQuery = () => {
    setQuery("");
    setFilters({ limit: 100 });
  };

  return (
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
  )
}
