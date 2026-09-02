import React from 'react'
import { LandingHeader, LandingFooter } from "@/components/landing"
import { makePageMetadata } from "@/lib/seo"

export const metadata = makePageMetadata({
  title: "Privacy Policy",
  description: "How OneMinute Logs collects, uses, and protects your information.",
  path: "/privacy",
});

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-sky-500/20 selection:text-sky-100">
      <LandingHeader />

      <main className="flex-1">
        <div className="md:w-[71%] w-[90%] mx-auto py-10 space-y-8">
          {/* Page header */}
          <header className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              Privacy Policy
            </h1>
            <p className="text-white/60!">
              How OneMinute Logs collects, uses, shares, and protects your information.
            </p>
            <p className="text-xs text-white/40!">
              Applies to the website, dashboard, SDKs, and APIs.
            </p>
          </header>

          {/* Flat content sections (no cards, no borders) */}
          <section className="px-3 space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-white">Overview & Scope</h2>
              <p className="text-sm text-white/70!">
                This policy covers personal information we process when you use OneMinute Logs,
                including our site, dashboard, SDKs, and APIs. “Personal information” means any data
                that identifies or could reasonably be linked to an individual.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-white">Information We Collect</h2>
              <ul className="list-disc pl-5 text-sm text-white/70! space-y-1">
                <li>Account data: name, email, authentication profile, plan and billing metadata.</li>
                <li>Product usage: requests, performance metrics, device/browser, timestamps, region.</li>
                <li>Logs you send: messages, context fields, and metadata via SDKs/APIs.</li>
                <li>Cookies/identifiers: session tokens, preferences, and analytics signals.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-white">How We Use Data</h2>
              <ul className="list-disc pl-5 text-sm text-white/70 space-y-1">
                <li>Operate, maintain, and improve the logging platform.</li>
                <li>Authenticate sessions, secure the service, and prevent abuse.</li>
                <li>Provide support, resolve issues, and communicate product updates.</li>
                <li>Produce aggregated, anonymized analytics to guide product decisions.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-white">Legal Bases & Your Rights</h2>
              <p className="text-sm text-white/70!">
                Where applicable (e.g., GDPR/CCPA), we rely on legitimate interests, contract
                performance, and consent for processing. You may have rights to access, correct,
                delete, port, or restrict processing of your personal data. We honor opt‑out requests
                for marketing communications and support regional privacy requirements.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-white">Cookies & Tracking</h2>
              <p className="text-sm text-white/70!">
                We use cookies and similar technologies for session authentication, preferences,
                and usage analytics. You can manage cookies in your browser settings; blocking some
                cookies may affect product functionality.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-white">Data Retention</h2>
              <p className="text-sm text-white/70!">
                Retention depends on your plan (e.g., shorter on free tiers, longer on paid tiers).
                You can delete logs or request account deletion through the dashboard or API at any time.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-white">Security</h2>
              <p className="text-sm text-white/70!">
                We protect data in transit and at rest using industry‑standard controls. Access to systems
                is restricted and audited. No method is 100% secure—please keep your API keys confidential
                and rotate them regularly.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-white">Sharing & Transfers</h2>
              <p className="text-sm text-white/70!">
                We do not sell personal information. We may share limited data with trusted providers
                (hosting, email, analytics) solely to deliver the service, subject to agreements and safeguards.
                Data may be processed in regions outside your locale with appropriate protections.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-white">International Transfers</h2>
              <p className="text-sm text-white/70!">
                When transferring data across borders, we implement measures consistent with applicable laws,
                including contractual protections and technical safeguards.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-white">Children’s Privacy</h2>
              <p className="text-sm text-white/70!">
                Our service is not directed to children under 13, and we do not knowingly collect their personal data.
                If you believe a child has provided data to us, contact support and we will promptly address it.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-white">Governing Law</h2>
              <p className="text-sm text-white/70!">
                This Privacy Policy is governed by the laws of the United States of America. Where relevant,
                applicable state laws may also apply.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-white">Your Choices & Contact</h2>
              <ul className="list-disc pl-5 text-sm text-white/70! space-y-1">
                <li>Access, update, export, or delete your account data from the dashboard.</li>
                <li>Delete or export logs via API where supported by your plan.</li>
                <li>For privacy inquiries, use the support channels listed in your dashboard.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-white">Changes to This Policy</h2>
              <p className="text-sm text-white/70!">
                We may update this policy as the product evolves. If material changes occur, we will notify you
                within the product or on our site. Continued use indicates acceptance of the updated policy.
              </p>
            </div>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}

export default Page