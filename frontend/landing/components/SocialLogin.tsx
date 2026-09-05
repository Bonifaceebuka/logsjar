import React from 'react'
import { FaGithub, FaGoogle } from "react-icons/fa6";

export default function SocialLogin() {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github`;
  };

    return (
        <div className="space-y-3">
            <button
                type="button"
                onClick={handleGoogleLogin}
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
            </button>

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
