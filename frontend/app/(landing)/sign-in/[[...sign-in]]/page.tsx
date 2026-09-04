"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
} from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa6";

type LoginStep = "email" | "password";

export default function Page() {
  const [step, setStep] = useState<LoginStep>("email");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailContinue = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setEmail(trimmedEmail);
    setStep("password");
  };

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

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github`;
  };

  const handleChangeEmail = () => {
    setPassword("");
    setError("");
    setStep("email");
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-4 py-8 text-foreground">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Hero gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(217_91%_60%_/_0.15),transparent_50%),radial-gradient(ellipse_at_bottom,hsl(263_70%_50%_/_0.15),transparent_50%)]" />

        {/* Grid */}
        <div
          className="
            absolute inset-0
            opacity-[0.035]
            [background-image:linear-gradient(hsl(215_20%_65%_/_0.4)_1px,transparent_1px),linear-gradient(90deg,hsl(215_20%_65%_/_0.4)_1px,transparent_1px)]
            [background-size:4rem_4rem]
            [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]
          "
        />

        {/* Primary glow */}
        <div className="absolute left-1/2 top-[-15rem] h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />

        {/* Secondary glow */}
        <div className="absolute bottom-[-15rem] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-secondary/20 blur-[120px]" />

        {/* Small decorative glow */}
        <div className="absolute left-[15%] top-[25%] h-32 w-32 rounded-full bg-primary/10 blur-[80px]" />
        <div className="absolute right-[15%] bottom-[25%] h-32 w-32 rounded-full bg-accent/10 blur-[80px]" />
      </div>

      {/* Main */}
      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-[0_0_25px_hsl(217_91%_60%_/_0.3)] transition-transform duration-300 group-hover:scale-105">
              <span className="text-sm font-bold text-white">
                O
              </span>
            </div>

            <span className="text-lg font-bold tracking-tight text-white">
              OneMinute<span className="gradient-text">Logs</span>
            </span>
          </Link>
        </div>

        {/* Card */}
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
                  ? "Welcome back"
                  : "Enter your password"}
              </h1>
            </div>

            <p className="text-sm leading-6 text-muted-foreground">
              {step === "email"
                ? "Sign in to your account to continue"
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

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-border" />

                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  or continue with email
                </span>

                <div className="h-px flex-1 bg-border" />
              </div>

              <form
                onSubmit={handleEmailContinue}
                className="space-y-5"
              >
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      autoFocus
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setError("");
                      }}
                      placeholder="you@example.com"
                      className="
                        h-12 w-full rounded-xl
                        border border-input
                        bg-background/40
                        pl-10 pr-4
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

                {/* Continue */}
                <button
                  type="submit"
                  className="
                    flex h-12 w-full items-center justify-center
                    rounded-xl
                    bg-sky-500/90
                    text-sm font-semibold text-white
                    shadow-[0_0_25px_hsl(217_91%_60%_/_0.2)]
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:shadow-[0_0_35px_hsl(217_91%_60%_/_0.35)]
                    active:translate-y-0
                  "
                >
                  Continue
                </button>
              </form>
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
                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-foreground"
                    >
                      Password
                    </label>

                    <Link
                      href={`/forgot-password?email=${encodeURIComponent(
                        email
                      )}`}
                      className="text-xs font-medium text-primary transition-colors hover:text-primary-glow"
                    >
                      Forgot password?
                    </Link>
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
              href="/sign-up"
              className="font-medium text-primary transition-colors hover:text-primary-glow"
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* Terms */}
        <p className="mt-5 px-4 text-center text-[11px] leading-5 text-muted-foreground/70">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}