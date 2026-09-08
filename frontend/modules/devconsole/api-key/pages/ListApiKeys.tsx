"use client";

import React from 'react'
import { Button } from "@/components/ui/button";

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
import NewApiKeyDialog from "@/modules/devconsole/api-key/components/NewApiKeyDialog";
import { useFetchApiKeys } from '../api/api-key.api';
import ListApiKeyTable from '../components/ListApiKeyTable';

export default function ListApiKeys() {
  const [generateOpen, setGenerateOpen] = React.useState(false);
  const [revealOpen, setRevealOpen] = React.useState(false);
  const [generatedSecret, setGeneratedSecret] = React.useState<string | null>(
    null,
  );
  const {
    data: apiKeys,
    isLoading: isLoadingKeys
  } = useFetchApiKeys();

  const [copied, setCopied] = React.useState(false);

  const copyGeneratedSecret = () => {
    if (!generatedSecret) return;
    navigator.clipboard.writeText(generatedSecret);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const limitReached = apiKeys?.length >= 5;

  // const lastGeneratedAgo = React.useMemo(() => {
  //   const timestamps = keys
  //     .map((k) => Date.parse(k.created))
  //     .filter((t) => !Number.isNaN(t));
  //   if (timestamps.length === 0) return "—";
  //   const latest = Math.max(...timestamps);
  //   const diffMs = Date.now() - latest;
  //   const secs = Math.floor(diffMs / 1000);
  //   const mins = Math.floor(secs / 60);
  //   const hours = Math.floor(mins / 60);
  //   const days = Math.floor(hours / 24);
  //   if (days >= 1) return `${days} day${days > 1 ? "s" : ""} ago`;
  //   if (hours >= 1) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  //   if (mins >= 1) return `${mins} min${mins > 1 ? "s" : ""} ago`;
  //   return "just now";
  // }, [keys]);

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
        {apiKeys?.length > 0 && (

          <div className="flex items-center justify-between px-3 py-2">
            <h3 className="text-sm font-medium">Your API ApiKeys</h3>
            <span className="text-xs text-muted-foreground">
              {apiKeys?.length} keys
            </span>
          </div>
        )}

        {apiKeys?.length === 0 ? (

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

            <ListApiKeyTable 
              apiKeys={apiKeys?.data || []}
            />
          </div>
        )}
      </div>
      {/* Generate New API Key Modal */}
      <NewApiKeyDialog 
        generateNewApiDialogOpen={generateOpen} 
        setGenerateNewApiDialogOpen={setGenerateOpen}
        setGeneratedSecret={setGeneratedSecret}
        limitReached={apiKeys?.data?.limitReached || false}
        setRevealOpen={setRevealOpen}
      />

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
        {/* <div className="flex items-center gap-6">
          <span className="text-muted-foreground">Active Keys</span>
          <span className="font-medium">{activeCount}</span>
          <span className="text-muted-foreground">Revoked</span>
          <span className="font-medium">{revokedCount}</span>
          <span className="text-muted-foreground">Last Generated</span>
          <span className="font-medium">{lastGeneratedAgo}</span>
        </div> */}
      </div>
    </div>
  )
}
