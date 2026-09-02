"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Bell } from "lucide-react";
import { toast } from "sonner";

export default function Page() {
  type AlertRow = {
    name: string;
    condition: string;
    status: "Active" | "Resolved";
    severity: "High" | "Medium" | "Low";
    lastTriggered: string;
  };

  const statusColors: Record<AlertRow["status"], string> = {
    Active: "#00C2A8",
    Resolved: "#6B7280",
  };
  const severityColors: Record<AlertRow["severity"], string> = {
    High: "#F87171",
    Medium: "#FBBF24",
    Low: "#34D399",
  };

  const initialAlerts: AlertRow[] = [];

  const [alerts, setAlerts] = React.useState<AlertRow[]>(initialAlerts);
  const [selected, setSelected] = React.useState<AlertRow | null>(null);
  const [newAlertOpen, setNewAlertOpen] = React.useState(false);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Alerts</h1>
          <p className="text-sm text-muted-foreground">
            Monitor and manage active log-based alerts.
          </p>
        </div>
        <Button
          className="rounded-xl"
          onClick={() => toast.error("Alert creation coming soon from v2")}
        >
          <Plus className="h-4 w-4" />
          New Alert
        </Button>
      </div>

      {/* Alerts Table */}
      <div
        className="rounded-xl border"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >

        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 mb-4">
              <Bell className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No alerts configured</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              You haven&apos;t created any alerts yet. Set up alerts to get notified
              about critical events in your system.
            </p>
          </div>
        ) : (
          <div className="relative">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Last Triggered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((a, idx) => (
                  <TableRow
                    key={`${a.name}-${idx}`}
                    className="cursor-pointer transition-colors"
                    style={{ borderColor: "rgba(255,255,255,0.05)" }}
                    onClick={() => setSelected(a)}
                  >
                    <TableCell className="text-white/90">{a.name}</TableCell>
                    <TableCell className="text-white/80">
                      {a.condition}
                    </TableCell>
                    <TableCell
                      className="font-medium"
                      style={{ color: statusColors[a.status] }}
                    >
                      {a.status}
                    </TableCell>
                    <TableCell
                      className="font-medium"
                      style={{ color: severityColors[a.severity] }}
                    >
                      {a.severity}
                    </TableCell>
                    <TableCell className="text-white/60">
                      {a.lastTriggered}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Row hover tint */}
            <style>{`
              [data-slot="table-row"]:hover {
                background: rgba(255,255,255,0.05);
              }
            `}</style>
          </div>
        )}
      </div>

      {/* Alert Detail Drawer (right side) */}


      {/* New Alert Modal */}
      <Dialog open={newAlertOpen} onOpenChange={setNewAlertOpen}>
        <DialogContent className="sm:max-w-120">
          <DialogHeader>
            <DialogTitle>Create New Alert</DialogTitle>
            <DialogDescription>
              Configure a new alert. It will be triggered when the condition
              matches.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Alert Name
              </div>
              <Input placeholder="Enter alert name" className="rounded-xl" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Condition
              </div>
              <Input
                placeholder="e.g. error_rate > 5%"
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Severity
                </div>
                <Select defaultValue="Medium">
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Notification Channel
                </div>
                <Select defaultValue="Slack">
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Slack">Slack</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Webhook">Webhook</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Threshold Period
                </div>
                <Select defaultValue="15m">
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5m">5m</SelectItem>
                    <SelectItem value="15m">15m</SelectItem>
                    <SelectItem value="1h">1h</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                className="rounded-xl"
                onClick={() => setNewAlertOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="rounded-xl"
                onClick={() => setNewAlertOpen(false)}
              >
                Save Alert
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer status bar */}
      <div
        className="flex items-center justify-between rounded-xl border px-3 py-2 text-xs"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="flex items-center gap-6">
          <span className="text-muted-foreground">Active</span>
          <span className="font-medium">0</span>
          <span className="text-muted-foreground">Muted</span>
          <span className="font-medium">0</span>
          <span className="text-muted-foreground">Resolved</span>
          <span className="font-medium">0</span>
        </div>
      </div>
    </div>
  );
}
