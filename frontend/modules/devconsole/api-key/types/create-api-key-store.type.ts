import { QueryClient, UseMutateFunction } from "@tanstack/react-query";
import { NewApiKeyFormData } from "../dtos/api-key-schema";
import { IApiResponse, FormState } from "@/common/types";

export interface CreateNewApiKeyStore extends FormState {
  reset: () => void;
  createNewApiKey: (
    data: NewApiKeyFormData,
    mutate: UseMutateFunction<{ data: IApiResponse<any> },
      Error,
      NewApiKeyFormData,
      unknown
    >,
    queryClient: QueryClient,
    handleOnModalClose: any,
    setGeneratedSecret: (secret: string | null) => void,
    setRevealOpen: (open: boolean) => void,
    navigate: (path: string) => void,
    toast: (options: {
      title: string;
      description: string;
      variant?: "destructive";
    }) => void
  ) => void;
}