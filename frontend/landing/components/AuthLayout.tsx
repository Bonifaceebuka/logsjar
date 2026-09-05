"use client";

import Link from "next/link";
import Logo from "@/components/common/logo";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>
) {
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
            <Logo />
          </Link>
        </div>

        {/* Card */}
        { children }

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
  )
}
