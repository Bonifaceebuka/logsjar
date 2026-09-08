import React from 'react'
import {
    Table,
    TableHeader,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Trash2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { useToast } from '@/common/hooks/use-toast';
import { timeAgo } from '@/common/utils/date.util';

export default function ListApiKeyTable({
    apiKeys
}:{
    apiKeys: any[]
}) {
  const { toast } = useToast();
    return (
        <Table className="min-w-full">
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Environment</TableHead>
                    <TableHead>API Key</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {apiKeys?.map((k: any, idx: number) => (
                  <TableRow
                    key={`${k.name}-${idx}`}
                    className="cursor-pointer transition-colors hover:bg-white/5"
                  >
                    <TableCell className="text-white/90">{k.name}</TableCell>
                    <TableCell className="text-white/80">{k.environment}</TableCell>
                    <TableCell className="text-white/80">{k.masked_key}</TableCell>
                    <TableCell className="text-white/70">{ timeAgo(k.created_at) }</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {k.status !== "Revoked" && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-lg"
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Revoke
                                </Button>
                              </span>
                            </TooltipTrigger>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
        </Table>
    )
}
