import React from "react";
import Link from "next/link";

export function LandingCTA() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-50">
          Focus on your product. <br />
          We&apos;ll handle your logs.
        </h2>
        <p className="mt-6 text-sm sm:text-base text-slate-400">
          Set up in under a minute. No learning curve. No maintenance.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-sky-500/90 px-6 py-3 text-sm font-semibold tracking-tight text-slate-950 shadow-sm hover:bg-sky-400 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/docs"
            target="_blank"
            className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-950/80 px-6 py-3 text-sm font-medium tracking-tight text-slate-100 hover:border-slate-500 hover:bg-slate-900 transition-colors"
          >
            View Docs
          </Link>
        </div>
      </div>
    </section>
  );
}
