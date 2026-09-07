// Top imports
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Gauge, Timer, Rocket, Settings2 } from "lucide-react";

// Define companies and map to logo paths under /public/logos
const companies = [
  { name: "Clerk", logo: "/logos/clerk.svg" },
  { name: "Neon", logo: "/logos/neon.svg" },
  { name: "Expo", logo: "/logos/expo.svg", invert: true },
  { name: "Inngest", logo: "/logos/inngest.svg" },
  { name: "LiveKit", logo: "/logos/livekit.svg", invert: true },
  { name: "Convex", logo: "/logos/convex.svg", scale: 1.8 },
  { name: "ScaleKit", logo: "/logos/scalekit.svg", scale: 1.3 },
];

// Add the missing LogoAvatar helper
function LogoAvatar({
  src,
  alt,
  size = 60,
  invert = false,
  scale = 1,
}: {
  src: string;
  alt: string;
  size?: number;
  invert?: boolean;
  scale?: number;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      {!failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-contain ${invert ? "filter invert" : ""}`}
          style={{ transform: `scale(${scale})` }}
          onError={() => setFailed(true)}
          priority={false}
        />
      ) : (
        <span className="text-[10px] font-semibold text-slate-200">
          {alt.charAt(0)}
        </span>
      )}
    </div>
  );
}

export function LandingTrustedBy() {
  return (
    <>
      {/* Key Metrics Row */}
      <section className="border-b border-slate-900/80 bg-slate-950/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-4 flex items-start gap-3">
              <div className="mt-0.5">
                <Gauge className="h-4 w-4 text-sky-400" />
              </div>
              <div>
                <div className="text-xs font-medium tracking-tight text-slate-200">
                  2M+ logs/min ingest capacity
                </div>
                <div className="mt-1 text-[0.7rem] text-slate-500">
                  Built to keep up with busy apps.
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-4 flex items-start gap-3">
              <div className="mt-0.5">
                <Timer className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-medium tracking-tight text-slate-200">
                  &lt;50ms average search time
                </div>
                <div className="mt-1 text-[0.7rem] text-slate-500">
                  Find what you need instantly.
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-4 flex items-start gap-3">
              <div className="mt-0.5">
                <Rocket className="h-4 w-4 text-indigo-400" />
              </div>
              <div>
                <div className="text-xs font-medium tracking-tight text-slate-200">
                  Start logging in under 60 seconds
                </div>
                <div className="mt-1 text-[0.7rem] text-slate-500">
                  From install to first log, fast.
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-4 flex items-start gap-3">
              <div className="mt-0.5">
                <Settings2 className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <div className="text-xs font-medium tracking-tight text-slate-200">
                  Zero config needed
                </div>
                <div className="mt-1 text-[0.7rem] text-slate-500">
                  No YAML, no servers, no tuning.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section with Marquee + Opacity Animation */}
      <section className="border-b border-slate-900/80 bg-slate-950 overflow-hidden">
        <div className="py-12">
          <p className="text-center text-sm font-medium tracking-wide text-slate-500 mb-4">
            Loved by developers from the world’s leading organizations
          </p>

          <div className="relative flex w-[80%] md:w-[60%] m-auto flex-col items-center justify-center overflow-hidden">
            <div className="group flex overflow-hidden p-2 [--gap:4.5rem] gap-(--gap) flex-row w-full max-w-6xl mx-auto mask-linear-fade">
              <div className="flex shrink-0 justify-start gap-(--gap) animate-marquee animation-duration-[80s] flex-row group-hover:paused">
                {[...companies, ...companies].map((c, i) => (
                  <div
                    key={`${c.name}-${i}`}
                    className={`flex items-center ${
                      c.name === "Convex" ? "opacity-90" : "opacity-100"
                    } cursor-default`}
                  >
                    <LogoAvatar
                      src={c.logo}
                      alt={c.name}
                      size={75}
                      invert={c.invert}
                      scale={c.scale}
                    />
                  </div>
                ))}
              </div>
              <div
                className="flex shrink-0 justify-start gap-(--gap) animate-marquee animation-duration-[80s] flex-row group-hover:paused"
                aria-hidden="true"
              >
                {[...companies, ...companies].map((c, i) => (
                  <div
                    key={`${c.name}-sm-${i}`}
                    className={`flex items-center ${
                      c.name === "Convex" ? "opacity-90" : "opacity-100"
                    } cursor-default`}
                  >
                    <LogoAvatar
                      src={c.logo}
                      alt={c.name}
                      size={75}
                      invert={c.invert}
                      scale={c.scale}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-slate-950"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-linear-to-l from-slate-950"></div>
          </div>
        </div>
      </section>
    </>
  );
}
