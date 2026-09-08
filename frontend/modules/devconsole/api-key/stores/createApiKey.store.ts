import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  formatValidationMessage,
  ErrorMessages,
} from "@/common/utils/error-message-formatter";
import { AxiosError } from "axios";
import { CreateNewApiKeyStore } from "../types/create-api-key-store.type";

export const useCreateNewApiKeyStore =
  create<CreateNewApiKeyStore>()(
    devtools((set, get) => ({
      submitting: false,
      successMsg: "",
      errorMsg: "",

      reset: () =>
        set({
          submitting: false,
          successMsg: "",
          errorMsg: "",
        }),

      createNewApiKey: async (formData, mutate, queryClient, handleOnModalClose, setGeneratedSecret, setRevealOpen, navigate, toast) => {
        set({ submitting: true, errorMsg: "", successMsg: "" });

        mutate(formData, {
          onSuccess(response) {
            const { status_code, message, data } = response.data;
            if (status_code === 200 || status_code === 201) {
              const { api_key } = data;
              set({
                submitting: false,
                successMsg: message,
              });

              queryClient.invalidateQueries({ queryKey: ["api-keys"] });
              toast({
                title: message,
                description: "Create new API Key!",
              });

              handleOnModalClose()
              setRevealOpen(true)
              setGeneratedSecret(api_key)
            } else if (status_code === 400) {
              const errorMessages = message;
              const firstMessage = Array.isArray(errorMessages)
                ? formatValidationMessage(
                    errorMessages as unknown as ErrorMessages
                  )[0] || "Some required fields are still empty!"
                : errorMessages;

              set({ submitting: false, errorMsg: firstMessage });
              toast({
                title: errorMessages,
                variant: "destructive",
                description: "Create new API Key!",
              });
            } else {
              set({
                submitting: false,
                errorMsg: "Something went wrong. Please try again!",
              });

              toast({
                title: message,
                variant: "destructive",
                description: "Create new API Key!",
              });
            }
          },

          onError(error) {
            if (error instanceof AxiosError) {
              const message = error?.response?.data.message;
              toast({
                title: message,
                variant: "destructive",
                description: "Create new API Key!",
              });
              set({
                submitting: false,
                errorMsg: message || "Request failed.",
              });
            } else {
              set({
                submitting: false,
                errorMsg: "Internal server error. Please try again!",
              });

              toast({
                title: "Internal server error. Please try again!",
                variant: "destructive",
                description: "Create new API Key!",
              });
            }
          },
        });
      },
    }))
  );