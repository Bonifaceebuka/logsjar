import React from 'react'
import { API_KEY_ENVIRONMENTS } from "@logsjar/shared";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function NewApiKeyDialog({
  generateOpen,
  setGenerateOpen,
  limitReached,
}: {
  generateOpen: boolean;
  setGenerateOpen: (open: boolean) => void;
  limitReached: boolean;
}) {
  const [newName, setNewName] = React.useState("");
  const [newEnvironment, setNewEnvironment] = React.useState<API_KEY_ENVIRONMENTS>(API_KEY_ENVIRONMENTS.PRODUCTION);

  return (
    <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent className="sm:max-w-120">
          <DialogHeader>
            <DialogTitle>Generate New API Key</DialogTitle>
            <DialogDescription>
              Create a new API key. You will only see
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
                <div className="text-xs text-muted-foreground mb-1">Environment</div>
                <Select
                  value={newEnvironment}
                  // onValueChange={(v) => setNewEnvironment(v as KeyRow["environment"])}
                >
                  <SelectTrigger className="w-full rounded-md">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem defaultValue={API_KEY_ENVIRONMENTS.PRODUCTION}>Production</SelectItem> */}
                    <SelectItem value={API_KEY_ENVIRONMENTS.DEVELOPMENT}>Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                className="rounded-md hover:bg-muted/50"
                onClick={() => setGenerateOpen(false)}
                // disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                className="rounded-md"
                // onClick={createKey}
                // disabled={isCreating || limitReached}
              >
                {/* {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating…
                  </>
                ) : (
                  "Create Key"
                )} */}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
  )
}
