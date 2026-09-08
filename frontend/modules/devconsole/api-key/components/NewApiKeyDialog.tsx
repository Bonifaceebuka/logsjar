import { API_KEY_ENVIRONMENTS } from "@logsjar/shared";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { NewApiKeyFormData, newApiKeySchema } from '../dtos/api-key-schema';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateNewApiKey } from '../api/api-key.api';
import { useToast } from '@/common/hooks/use-toast';
import { useCreateNewApiKeyStore } from '../stores/createApiKey.store';

export default function NewApiKeyDialog({
  generateNewApiDialogOpen,
  setGenerateNewApiDialogOpen,
  limitReached,
}: {
  generateNewApiDialogOpen: boolean;
  setGenerateNewApiDialogOpen: (open: boolean) => void;
  limitReached: boolean;
}) {
  const navigate = useRouter();
  const { mutate } = useCreateNewApiKey();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewApiKeyFormData>({
    resolver: zodResolver(newApiKeySchema),
    defaultValues: {
      name: "",
      environment: API_KEY_ENVIRONMENTS.PRODUCTION as string,
    },
  });

  const { createNewApiKey, submitting } = useCreateNewApiKeyStore();

  const handleLogin = async (data: NewApiKeyFormData) => {
    createNewApiKey(data, mutate, queryClient, setGenerateNewApiDialogOpen, navigate.push, toast);
  };

  return (
    <Dialog open={generateNewApiDialogOpen} onOpenChange={setGenerateNewApiDialogOpen}>
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
            <form onSubmit={handleSubmit(handleLogin)}>
              <div>
                {errors && (
                  <p className="text-red-500 text-sm mt-1">
                    {
                      errors?.name?.message
                    }
                  </p>
                )}
                <div className="text-xs text-muted-foreground mb-1">Key Name</div>
                <Input
                  placeholder="Enter key name"
                  className="rounded-md"
                   {...register("name")}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  {errors && (
                    <p className="text-red-500 text-sm mt-1">
                      {
                        errors?.environment?.message
                      }
                    </p>
                  )}
                  <div className="text-xs text-muted-foreground mb-1">Environment</div>
                  <Select
                     {...register("environment")}
                     defaultValue={API_KEY_ENVIRONMENTS.PRODUCTION}
                  >
                    <SelectTrigger className="w-full rounded-md">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={API_KEY_ENVIRONMENTS.PRODUCTION}>Production</SelectItem>
                      <SelectItem value={API_KEY_ENVIRONMENTS.DEVELOPMENT}>Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="ghost"
                  className="rounded-md hover:bg-muted/50"
                  onClick={() => setGenerateNewApiDialogOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  className="rounded-md"
                  type='submit'
                  disabled={submitting || limitReached}
                  isLoading={submitting}
                >
                  {submitting ? (
                    <>
                      Creating a new key…
                    </>
                  ) : (
                    "Create a new API Key"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
  )
}
