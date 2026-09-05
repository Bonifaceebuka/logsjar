import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { AxiosError } from "axios";
import {
  ILoginResponse,
  LoginWithSocialStore,
} from "@/common/types/IAuth";
import { IUser } from "@/common/types/IUser";

export const useLoginWithSocialStore = create<LoginWithSocialStore>()(
  devtools((set, get) => ({
    user: null,
    submitting: false,
    successMsg: "",
    errorMsg: "",

    setUser: (user: IUser | null) => set((state) => ({ ...state, user })),

    reset: () =>
      set({
        submitting: false,
        successMsg: "",
        errorMsg: "",
      }),

    handleGoogleCredential: (
      accessToken,
      mutate,
      queryClient,
      navigate,
      toast
    ) => {
      set({ submitting: true, errorMsg: "", successMsg: "" });
      mutate(accessToken, {
        onSuccess(response) {
          const { status_code, message, data } = response.data;

          if (status_code === 200 || status_code === 201) {
            const { user } = data as ILoginResponse;
            set({
              successMsg: message,
              submitting: false,
              user,
            });

            queryClient.invalidateQueries({ queryKey: ["userGoogleLogin"] });

            setTimeout(() => {
              toast({
                title: "Welcome back to LogsJar!",
                description: "User login!",
              });
              navigate("/console");
            }, 1500);
          } else if (status_code === 400) {
            set({ submitting: false, errorMsg: message });
            toast({
              title: "User login!!",
              variant: "destructive",
              description: message,
            });
          }
        },
        onError(error) {
          let errorMsg = "Internal server error. Please try again!";
          if (error instanceof AxiosError) {
            errorMsg = error?.response?.data.message || errorMsg;
          }

          set({ submitting: false, errorMsg });
          toast({
            title: "User login!!",
            variant: "destructive",
            description: errorMsg,
          });
        },
      });
    },
  }))
);
