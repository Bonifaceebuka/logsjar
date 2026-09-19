import { Input } from "@/common/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/common/components/ui/select";
import { LogLevel } from "@logsjar/shared";

export default function LiveLogsFilter({
    filterLevel,
    setFilterLevel,
    search,
    setSearch
}:{
    filterLevel: any,
    setFilterLevel: any,
    search: any,
    setSearch: any
}) {
  return (
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
  )
}
