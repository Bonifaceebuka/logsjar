"use client"

import { Mail } from 'lucide-react';
import React, { FormEvent, useState } from 'react'

type LoginStep = "email" | "password";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<LoginStep>("email");

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

    return (
        <>
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
        </>
    )
}
