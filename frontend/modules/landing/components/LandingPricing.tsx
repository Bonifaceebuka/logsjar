import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";

export function LandingPricing() {
    return (
        <section id="pricing" className="border-b border-slate-900/80">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-50">
                        Simple, predictable pricing.
                    </h2>
                    <p className="mt-3 text-sm text-slate-300">
                        Start for free. Upgrade when you grow—no surprises.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {/* Free */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 flex flex-col">
                        <div className="mb-4">
                            <div className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                                Free
                            </div>
                            <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-50">
                                $0
                                <span className="text-sm text-slate-500 font-normal">
                                    {" "}
                                    /mo
                                </span>
                            </div>
                            <div className="mt-2 text-sm text-slate-300">
                                Good for side projects and experiments.
                            </div>
                        </div>
                        <ul className="mt-4 mb-6 space-y-3 text-sm text-slate-400">
                            {[
                                "10k logs/month",
                                "7-day retention",
                                "Advanced search",
                                "Email support",
                                "Webhook alerts",
                                "API ACCESS"
                            ].map(
                                (feature) => (
                                    <li key={feature} className="flex items-center gap-2">
                                        <Check
                                            className="h-4 w-4 text-slate-600"
                                            strokeWidth={1.5}
                                        />
                                        {feature}
                                    </li>
                                )
                            )}
                        </ul>
                        <Link
                            href="#"
                            className="mt-auto w-full py-2 rounded-md border border-slate-800 bg-slate-900 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors text-center"
                        >
                            Start Free
                        </Link>
                    </div>

                    {/* Starter */}
                    <div className="rounded-2xl border border-sky-500/30 bg-slate-950/90 p-6 flex flex-col relative shadow-[0_0_20px_-5px_rgba(14,165,233,0.15)]">
                        <div className="absolute top-0 right-0 -mt-3 mr-4">
                            <span className="bg-sky-500 text-slate-950 text-[0.6rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                                Popular
                            </span>
                        </div>
                        <div className="mb-4">
                            <div className="text-xs font-medium tracking-wide text-sky-400 uppercase">
                                Starter
                            </div>
                            <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-50">
                                $9.99
                                <span className="text-sm text-slate-500 font-normal">
                                    {" "}
                                    /mo
                                </span>
                            </div>
                            <div className="mt-2 text-sm text-slate-300">
                                Affordable logging for small SaaS teams.
                            </div>
                        </div>
                        <ul className="mt-4 mb-6 space-y-3 text-sm text-slate-300">
                            {[
                                "100k logs/month",
                                "30-day retention",
                                "Advanced search",
                                "Priority support",
                                "Webhook alerts",
                                "API ACCESS"
                            ].map((feature) => (
                                <li key={feature} className="flex items-center gap-2">
                                    <Check
                                        className="h-4 w-4 text-sky-500"
                                        strokeWidth={1.5}
                                    />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link
                            href="#"
                            className="mt-auto w-full py-2 rounded-md bg-sky-500 text-xs font-bold text-slate-950 hover:bg-sky-400 transition-colors text-center"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Pro */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 flex flex-col">
                        <div className="mb-4">
                            <div className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                                Pro
                            </div>
                            <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-50">
                                $19.99
                                <span className="text-sm text-slate-500 font-normal">
                                    {" "}
                                    /mo
                                </span>
                            </div>
                            <div className="mt-2 text-sm text-slate-300">
                                For growing teams that ship every week.
                            </div>
                        </div>
                        <ul className="mt-4 mb-6 space-y-3 text-sm text-slate-400">
                            {[
                                "1M logs/month",
                                "90-day retention",
                                "Real-time alerts",
                                "Webhook alerts",
                                "24/7 support",
                                "API ACCESS"
                            ].map((feature) => (
                                <li key={feature} className="flex items-center gap-2">
                                    <Check
                                        className="h-4 w-4 text-slate-600"
                                        strokeWidth={1.5}
                                    />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link
                            href="#"
                            className="mt-auto w-full py-2 rounded-md border border-slate-800 bg-slate-900 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors text-center"
                        >
                            Choose Pro
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

