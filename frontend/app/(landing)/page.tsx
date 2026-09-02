import React from "react";
import {
  LandingHeader,
  LandingHero,
  LandingTrustedBy,
  LandingFeatures,
  LandingSetup,
  LandingTestimonials,
  LandingWhySwitch,
  LandingPricing,
  LandingCTA,
  LandingFooter,
} from "@/components/landing";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-sky-500/20 selection:text-sky-100">
      <LandingHeader />

      <main className="flex-1"> 
        <LandingHero />
        <LandingTrustedBy />
        <LandingFeatures />
        <LandingSetup />
        <LandingTestimonials />
        <LandingWhySwitch />
        <LandingPricing />
        <LandingCTA />
      </main>

      <LandingFooter />
    </div>
  );
}
