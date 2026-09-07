"use client"

import { useQueryClient } from "@tanstack/react-query";
import { FaGithub, FaGoogle } from "react-icons/fa6";
import { APP_CONFIGS } from "@/common/configs";
import { useUserGoogleLogin } from "../api/auth.api";
import { useLoginWithSocialStore } from "../store/useLoginStore";
import { useToast } from "@/common/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SocialLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient();
  const { mutate } = useUserGoogleLogin();
  const { handleGoogleCredential } = useLoginWithSocialStore();
  const { toast } = useToast();
  const navigate = useRouter();

  const handleGoogleSignin = useGoogleLogin({
    onSuccess: (credentialResponse: any) => {
      handleGoogleCredential(
        credentialResponse.access_token,
        mutate,
        queryClient,
        navigate.push,
        toast
      );
      setIsLoading(false)
    },
    onError: () => {
      setIsLoading(false)
      toast({
        title: "Login failed!",
        variant: "destructive",
        description: "Unable to login with the selected Google account",
      });
    },
  });

  const handleGithubLogin = () => {
    window.location.href = `${APP_CONFIGS.API_BASE_URL}/auth/socials/github`;
  };

    return (
        <div className="space-y-3">
            <Button
                type="button"
                onClick={()=>{
                  setIsLoading(true)
                  handleGoogleSignin()
                }}
              isLoading={isLoading}
              disabled={isLoading}
                className="
                    flex h-11 w-full items-center justify-center gap-3
                    rounded-xl border border-border
                    bg-muted/30
                    text-sm font-medium text-foreground
                    transition-all duration-300
                    hover:border-primary/40
                    hover:bg-primary/5
                    hover:shadow-[0_0_25px_hsl(217_91%_60%_/_0.08)]
                  "
            >
                <FaGoogle className="h-4 w-4" />
                <span>Continue with Google</span>
            </Button>

            <button
                type="button"
                onClick={handleGithubLogin}
                className="
                    flex h-11 w-full items-center justify-center gap-3
                    rounded-xl border border-border
                    bg-muted/30
                    text-sm font-medium text-foreground
                    transition-all duration-300
                    hover:border-primary/40
                    hover:bg-primary/5
                    hover:shadow-[0_0_25px_hsl(217_91%_60%_/_0.08)]
                  "
            >
                <FaGithub className="h-4 w-4" />
                <span>Continue with GitHub</span>
            </button>
        </div>
    )
}
