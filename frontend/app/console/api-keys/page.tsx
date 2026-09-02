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
import { Plus, Lock, Key, Clipboard, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type KeyRow = {
  name: string;
  scope: "Read Only" | "Write Only" | "Full Access";
  created: string;
  lastUsed: string;
  status: "Active" | "Revoked";
};

const statusColors: Record<KeyRow["status"], string> = {
  Active: "#00C2A8",
  Revoked: "#6B7280",
};

export default function Page() {
  type KeyRow = {
    id: string;
    name: string;
    scope: "Read Only" | "Write Only" | "Full Access";
    created: string;
    lastUsed: string;
    status: "Active" | "Revoked";
  };

  // Remove hardcoded seed; load from API instead
  const [keys, setKeys] = React.useState<KeyRow[]>([]);
  const [selected, setSelected] = React.useState<KeyRow | null>(null);
  const [generateOpen, setGenerateOpen] = React.useState(false);
  const [revealOpen, setRevealOpen] = React.useState(false);
  const [generatedSecret, setGeneratedSecret] = React.useState<string | null>(
    null,
  );
  const [newName, setNewName] = React.useState("");
  const [newScope, setNewScope] =
    React.useState<KeyRow["scope"]>("Full Access");
  const [newExpiry, setNewExpiry] = React.useState<
    "Never" | "30 Days" | "90 Days"
  >("Never");

  // New: creation loading state
  const [isCreating, setIsCreating] = React.useState(false);
  // New: loading state for fetching saved API keys
  const [isLoadingKeys, setIsLoadingKeys] = React.useState(true);
  // New: copied feedback state
  const [copied, setCopied] = React.useState(false);

  // Simple client-side cache for keys to avoid repeated fetching on reloads
  const CACHE_STORAGE_KEY = "oml_api_keys_cache";
  const CACHE_TTL_MS = 10 * 60_000; // 10 minutes TTL; increase to cut fetches further
  const inFlightRef = React.useRef<Promise<KeyRow[]> | null>(null);

  const refreshKeys = async (opts?: { force?: boolean }) => {
    setIsLoadingKeys(true);
    try {
      const now = Date.now();

      // Try cache first unless forced
      let cached: { data: KeyRow[]; timestamp: number } | null = null;
      try {
        const raw = localStorage.getItem(CACHE_STORAGE_KEY);
        if (raw) cached = JSON.parse(raw);
      } catch {}
      const isFresh = cached && now - cached.timestamp < CACHE_TTL_MS;

      if (!opts?.force && isFresh) {
        setKeys(cached!.data);
        return;
      }

      // Dedupe concurrent fetches
      if (!inFlightRef.current) {
        inFlightRef.current = fetch("/api/api-keys", {
          method: "GET",
          cache: "no-store",
        })
          .then(async (res) => {
            if (!res.ok) throw new Error("Failed to fetch API keys");
            return (await res.json()) as KeyRow[];
          })
          .finally(() => {
            inFlightRef.current = null;
          });
      }

      const data = await inFlightRef.current;
      setKeys(data);
      try {
        localStorage.setItem(
          CACHE_STORAGE_KEY,
          JSON.stringify({ data, timestamp: now }),
        );
      } catch {}
    } finally {
      setIsLoadingKeys(false);
    }
  };

  React.useEffect(() => {
    // Load keys on mount: check cache first, fetch from API if cache is empty or stale
    refreshKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createKey = async () => {
    setIsCreating(true);
    try {
      const res = await fetch("/api/api-keys/generate-secret-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName || "New Key",
          scope: newScope,
          expiresAt: newExpiry,
        }),
      });
      if (!res.ok) return;
      const { key } = await res.json();
      setGeneratedSecret(key);
      setRevealOpen(true);

      // Force refresh to ensure cache reflects the newly created key
      await refreshKeys({ force: true });
      setGenerateOpen(false);
      setNewName("");
      setNewScope("Read Only");
      setNewExpiry("Never");
    } finally {
      setIsCreating(false);
    }
  };

  const revokeSelected = async () => {
    if (!selected) return;

    // Prevent revoking the system-generated "Default" key
    if (selected.name === "Default") {
      toast.error("Cannot delete the system-generated Default API key");
      return;
    }

    // Prevent revoking the last active key
    if (activeCount <= 1 && selected.status === "Active") {
      toast.error("Cannot revoke the only active API key");
      return;
    }

    await fetch("/api/api-keys/revoke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selected.id }),
    });
    // Force refresh to reflect revocation immediately and update cache
    await refreshKeys({ force: true });
    setSelected((sel) => (sel ? { ...sel, status: "Revoked" } : sel));
  };

  const copyGeneratedSecret = () => {
    if (!generatedSecret) return;
    navigator.clipboard.writeText(generatedSecret);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const activeCount = React.useMemo(
    () => keys.filter((k) => k.status === "Active").length,
    [keys],
  );

  const limitReached = activeCount >= 5;

  const revokedCount = React.useMemo(
    () => keys.filter((k) => k.status === "Revoked").length,
    [keys],
  );
  const lastGeneratedAgo = React.useMemo(() => {
    const timestamps = keys
      .map((k) => Date.parse(k.created))
      .filter((t) => !Number.isNaN(t));
    if (timestamps.length === 0) return "—";
    const latest = Math.max(...timestamps);
    const diffMs = Date.now() - latest;
    const secs = Math.floor(diffMs / 1000);
    const mins = Math.floor(secs / 60);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days >= 1) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours >= 1) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (mins >= 1) return `${mins} min${mins > 1 ? "s" : ""} ago`;
    return "just now";
  }, [keys]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">API Keys</h1>
          <p className="text-sm text-muted-foreground">
            Manage and secure your project access credentials.
          </p>
        </div>
        {/* Disable generate button at limit; show tooltip */}
        <span className="inline-flex">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="rounded-md"
                onClick={() => setGenerateOpen(true)}
                disabled={limitReached}
              >
                <Plus className="h-4 w-4" />
                Generate New Key
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>
              {limitReached
                ? "Limit reached: 5 active keys per user"
                : "Create a new API key"}
            </TooltipContent>
          </Tooltip>
        </span>
      </div>

      {/* Info Card */}
      <div
        className="rounded-md border"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="flex items-start gap-3 p-6">
          <div className="mt-0.5">
            <Lock className="h-5 w-5 opacity-70" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium">API Key Security</h3>
            <p className="text-sm text-muted-foreground">
              Your API keys are sensitive credentials. Treat them like passwords
              — never share them publicly or commit them to version control.
              Each key is unique per project and can be revoked instantly if
              compromised. You will only see your key once upon creation for
              your security.
            </p>
          </div>
        </div>
      </div>

      {/* Keys Table */}
      <div className="rounded-md border">
        {keys.length > 0 && (
          <div className="flex items-center justify-between px-3 py-2">
            <h3 className="text-sm font-medium">Your API Keys</h3>
            <span className="text-xs text-muted-foreground">
              {keys.length} keys
            </span>
          </div>
        )}

        {keys.length === 0 ? (
          isLoadingKeys ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading saved API keys…
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Key className="mr-2 h-4 w-4" />
              No API keys created yet. Generate one to start using the OneMinute
              Logs API.
            </div>
          )
        ) : (
          <div className="relative">
            {/* Overlay spinner while refreshing keys list */}
            {isLoadingKeys && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Refreshing keys…
                </div>
              </div>
            )}

            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((k, idx) => (
                  <TableRow
                    key={`${k.name}-${idx}`}
                    className="cursor-pointer transition-colors hover:bg-white/5"
                    onClick={() => setSelected(k)}
                  >
                    <TableCell className="text-white/90">{k.name}</TableCell>
                    <TableCell className="text-white/80">{k.scope}</TableCell>
                    <TableCell className="text-white/70">{k.created}</TableCell>
                    <TableCell className="text-white/70">
                      {k.lastUsed}
                    </TableCell>
                    <TableCell
                      className="font-medium"
                      style={{ color: statusColors[k.status] }}
                    >
                      {k.status}
                    </TableCell>
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
                                  disabled={
                                    activeCount <= 1 && k.status === "Active"
                                  }
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    if (k.name === "Default") {
                                      toast.error(
                                        "Cannot delete the system-generated Default API key",
                                      );
                                      return;
                                    }
                                    if (
                                      activeCount <= 1 &&
                                      k.status === "Active"
                                    ) {
                                      toast.error(
                                        "Cannot revoke the only active API key",
                                      );
                                      return;
                                    }
                                    setSelected(k);
                                    await revokeSelected();
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
          </div>
        )}
      </div>

      {/* Key Detail Drawer (right side) */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="fixed right-0 top-0 h-full w-105 border-l p-4"
            style={{
              background: "#0E1117",
              borderColor: "rgba(255,255,255,0.08)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">API Key Details</h3>
              <div className="flex gap-2">
                {selected.status !== "Revoked" && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-md"
                          disabled={
                            (activeCount <= 1 &&
                              selected.status === "Active") ||
                            selected.name === "Default"
                          }
                          onClick={revokeSelected}
                        >
                          <Trash2 className="h-4 w-4" />
                          Revoke
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent sideOffset={6}>
                      {selected.name === "Default"
                        ? "Cannot delete the system-generated Default API key"
                        : activeCount <= 1 && selected.status === "Active"
                          ? "Cannot revoke the only active API key"
                          : "Revoke this API key"}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>

            <div className="mt-3 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span>{selected.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Scope</span>
                <span>{selected.scope}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{selected.created}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Used</span>
                <span>{selected.lastUsed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span style={{ color: statusColors[selected.status] }}>
                  {selected.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate New API Key Modal */}
      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent className="sm:max-w-120">
          <DialogHeader>
            <DialogTitle>Generate New API Key</DialogTitle>
            <DialogDescription>
              Create a new API key with scoped permissions. You will only see
              the key once.
            </DialogDescription>
          </DialogHeader>

          {/* Limit message */}
          {limitReached && (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              You have reached the limit of 5 active keys. Revoke one to create
              a new key.
            </div>
          )}

          <div className="space-y-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Key Name</div>
              <Input
                placeholder="Enter key name"
                className="rounded-md"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Scope</div>
                <Select
                  value={newScope}
                  onValueChange={(v) => setNewScope(v as KeyRow["scope"])}
                >
                  <SelectTrigger className="w-full rounded-md">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Access">Full Access</SelectItem>
                    <SelectItem value="Read Only">Read Only</SelectItem>
                    <SelectItem value="Write Only">Write Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Expiry</div>
                <Select
                  value={newExpiry}
                  onValueChange={(v) => setNewExpiry(v as typeof newExpiry)}
                >
                  <SelectTrigger className="w-full rounded-md">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Never">Never</SelectItem>
                    <SelectItem value="30 Days">30 Days</SelectItem>
                    <SelectItem value="90 Days">90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                className="rounded-md hover:bg-muted/50"
                onClick={() => setGenerateOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                className="rounded-md"
                onClick={createKey}
                disabled={isCreating || limitReached}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating…
                  </>
                ) : (
                  "Create Key"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* One-time Secret Reveal Dialog */}
      <Dialog
        open={revealOpen}
        onOpenChange={(open) => {
          setRevealOpen(open);
          if (!open) setGeneratedSecret(null);
        }}
      >
        <DialogContent
          className="sm:max-w-130"
          overlayClassName="fixed inset-0 z-50 bg-black/30 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out"
        >
          <DialogHeader>
            <DialogTitle>Your New API Key</DialogTitle>
            <DialogDescription>
              You will only see this key once. Copy and store it securely.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="rounded-md border p-3 text-sm font-mono">
              <div className="text-xs text-muted-foreground mb-1">Secret</div>
              <div className="flex items-start justify-between gap-2">
                <span className="flex-1 min-w-0 break-all">
                  {generatedSecret ?? "—"}
                </span>
                <Tooltip open={copied}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={
                        "rounded-md " +
                        (copied
                          ? "text-emerald-400 border-emerald-400 hover:bg-transparent"
                          : "hover:bg-muted hover:text-muted-foreground")
                      }
                      onClick={copyGeneratedSecret}
                      disabled={!generatedSecret}
                    >
                      <Clipboard className="h-4 w-4" />
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={6}>Copied!</TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              For security, we cannot show this key again or recover it later.
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                className="rounded-md"
                onClick={() => setRevealOpen(false)}
              >
                I stored it safely
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer status bar */}
      <div
        className="flex items-center justify-between rounded-md border px-3 py-2 text-xs"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="flex items-center gap-6">
          <span className="text-muted-foreground">Active Keys</span>
          <span className="font-medium">{activeCount}</span>
          <span className="text-muted-foreground">Revoked</span>
          <span className="font-medium">{revokedCount}</span>
          <span className="text-muted-foreground">Last Generated</span>
          <span className="font-medium">{lastGeneratedAgo}</span>
        </div>
      </div>
    </div>
  );
}
