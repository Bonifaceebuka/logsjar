"use client"

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  User,
} from "lucide-react";

import AuthLayout from "../components/AuthLayout";
import SocialLogin from "../components/SocialLogin";
import SignUpForm from "../components/SignUpForm";

type LoginStep = "email" | "password";
export default function SignUpPage() {
  const [step, setStep] = useState<LoginStep>("email");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  
  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Invalid email or password."
        );
      }

      console.log("Login successful:", data);

      // Example:
      // router.push("/dashboard");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEmail = () => {
    setPassword("");
    setError("");
    setStep("email");
  };

  return (
    <AuthLayout>
         <div className="glass rounded-2xl p-6 shadow-[0_16px_48px_hsl(228_84%_5%_/_0.6)] sm:p-8">
          {/* Header */}
          <div className="mb-7">
            <div className="mb-3 flex items-center gap-2">
              {step === "password" && (
                <button
                  type="button"
                  onClick={handleChangeEmail}
                  className="
                    flex h-8 w-8 items-center justify-center
                    rounded-lg border border-border
                    bg-muted/40 text-muted-foreground
                    transition-all duration-200
                    hover:border-primary/40
                    hover:bg-primary/10
                    hover:text-foreground
                  "
                  aria-label="Change email"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}

              <h1 className="text-xl font-bold tracking-tight text-white">
                {step === "email"
                  ? "Create a new account"
                  : "Enter your password"}
              </h1>
            </div>

            <p className="text-sm leading-6 text-muted-foreground">
              {step === "email"
                ? "Sign up to your account to continue"
                : "Enter your password to continue signing in"}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-destructive/20 bg-destructive/10 px-3.5 py-3 text-xs leading-5 text-red-400 animate-fade-in">
              {error}
            </div>
          )}

          {/* EMAIL STEP */}
          {step === "email" && (
            <div className="animate-fade-in">
              {/* Social login */}
              <SocialLogin />
              {/* <SignUpForm /> */}
            </div>
          )}

          {/* PASSWORD STEP */}
          {step === "password" && (
            <div className="animate-fade-in">
              {/* Account */}
              <div className="mb-5 flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-3.5 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 text-primary">
                  <Mail className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Signing in as
                  </p>

                  <p className="truncate text-sm font-medium text-foreground">
                    {email}
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >
                {/* Fullname & Password */}

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="fullname"
                      className="text-sm font-medium text-foreground"
                    >
                      Full name
                    </label>
                  </div>

                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="fullname"
                      type={"text"}
                      autoComplete="current-password"
                      autoFocus
                      // value={fullname}
                      placeholder="Enter your fullname"
                      className="
                        h-12 w-full rounded-xl
                        border border-input
                        bg-background/40
                        pl-10 pr-11
                        text-sm text-foreground
                        outline-none
                        placeholder:text-muted-foreground/60
                        transition-all duration-300
                        focus:border-primary/60
                        focus:bg-background/60
                        focus:ring-2
                        focus:ring-primary/20
                        focus:shadow-[0_0_25px_hsl(217_91%_60%_/_0.08)]
                      "
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-foreground"
                    >
                      Password
                    </label>
                  </div>

                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      autoFocus
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setError("");
                      }}
                      placeholder="Enter your password"
                      className="
                        h-12 w-full rounded-xl
                        border border-input
                        bg-background/40
                        pl-10 pr-11
                        text-sm text-foreground
                        outline-none
                        placeholder:text-muted-foreground/60
                        transition-all duration-300
                        focus:border-primary/60
                        focus:bg-background/60
                        focus:ring-2
                        focus:ring-primary/20
                        focus:shadow-[0_0_25px_hsl(217_91%_60%_/_0.08)]
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((value) => !value)
                      }
                      className="
                        absolute right-3 top-1/2
                        -translate-y-1/2
                        text-muted-foreground
                        transition-colors
                      "
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Login */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    flex h-12 w-full items-center justify-center
                    gap-2 rounded-xl
                    bg-sky-500/90
                    text-sm font-semibold text-white
                    shadow-[0_0_25px_hsl(217_91%_60%_/_0.2)]
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:shadow-[0_0_35px_hsl(217_91%_60%_/_0.35)]
                    active:translate-y-0
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Sign up */}
          <div className="mt-7 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-primary transition-colors hover:text-primary-glow"
            >
              Sign in
            </Link>
          </div>
        </div>
    </AuthLayout>
  );
}
