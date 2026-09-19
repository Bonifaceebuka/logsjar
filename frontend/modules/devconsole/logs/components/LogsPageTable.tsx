import React from 'react'
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/common/components/ui/table";
import { levelColor } from '../pages/LogsPage';

export default function LogsPageTable(
    {
        results,
        setSelected
    }: { 
        results: any[],
        setSelected: any
    }
) {
  return (
    <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>App</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Environment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r, idx) => (
                  <TableRow
                    key={`${r.timestamp ?? "t"}-${idx}`}
                    className="cursor-pointer"
                    onClick={() => setSelected(r)}
                  >
                    <TableCell className="text-white/60">
                      {r.timestamp ?? "—"}
                    </TableCell>
                    <TableCell
                      className="font-medium"
                      style={{
                        color:
                          levelColor[
                          String(
                            r.type || ""
                          ).toLowerCase() as keyof typeof levelColor
                          ] ?? "inherit",
                      }}
                    >
                      {String(r.type || "").toUpperCase() || "—"}
                    </TableCell>
                    <TableCell className="text-white/80">
                      {r.appName ?? "—"}
                    </TableCell>
                    <TableCell className="text-white/90">
                      {r.message ?? "—"}
                    </TableCell>
                    <TableCell className="text-white/70">
                      {r.environment ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
  )
}
