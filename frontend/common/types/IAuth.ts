import { FormState, IApiResponse } from ".";
import { QueryClient, UseMutateFunction } from "@tanstack/react-query";
import { IUser } from "./IUser";

export interface AuthDialogProps {
  onClose: () => void;
  isOpen?: boolean;
  mode: "login" | "signup" | "reset";
  onModeChange?: (mode: "login" | "signup" | "reset") => void;
}

export interface ILoginResponse {
  expires_at: string;
  user: IUser;
  access_token: string;
}

export interface ILoginResponseEmail {
  expires_at: string;
  user: IUser;
  token: string;
}

export interface IRegister {
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
  uuid: string;
}

export interface RegisterResponseData {
  user: {
    created_at: string;
    email: string;
    first_name: string;
    last_name: string;
    uuid: string;
  };
  jwtDetails: string;
}

export interface IAuthenticatedUserStore {
  user: IUser | null;
  setUser: (user: IUser) => void;
  logout: () => void;
}

export interface GoogleAuthCredentials {
  access_token: string;
}

export interface LoginWithSocialStore extends FormState {
  user: IUser | null;
  reset: () => void;
  setUser: (user: IUser | null) => void;
  handleGoogleCredential: (
    accessToken: string,
    mutate: UseMutateFunction<
      { data: IApiResponse<ILoginResponse> },
      Error,
      string,
      unknown
    >,
    queryClient: QueryClient,
    navigate: (path: string) => void,
    toast: (options: {
      title: string;
      description: string;
      variant?: "destructive";
    }) => void
  ) => void;
}
