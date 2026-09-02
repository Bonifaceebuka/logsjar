import React from 'react'
import { LandingHeader, LandingFooter } from "@/components/landing"
import { makePageMetadata } from "@/lib/seo"

export const metadata = makePageMetadata({
  title: "Terms of Service",
  description: "The rules that govern your use of OneMinute Logs.",
  path: "/terms",
});

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-sky-500/20 selection:text-sky-100">
      <LandingHeader />

      <main className="flex-1">
        <div className="md:w-[71%] w-[90%] mx-auto py-8 space-y-8">
          <header className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              Terms of Service
            </h1>
            <p className="text-white/60! pb-2">
              These terms govern your use of OneMinute Logs. Please read them
              carefully.
            </p>
          </header>

          <section className="grid">
            <div className=" px-6 pb-4">
              <h2 className="text-lg font-semibold text-white">
                Acceptance of Terms
              </h2>
              <p className="text-sm text-white/70!">
                By creating an account or using the service, you agree to these
                Terms and our Privacy Policy.
              </p>
            </div>

            <div className="px-6 pb-4">
              <h2 className="text-lg font-semibold text-white">
                Accounts & Security
              </h2>
              <ul className="list-disc pl-5 text-sm text-white/70 space-y-2">
                <li>
                  You are responsible for safeguarding your credentials and API
                  keys.
                </li>
                <li>
                  Notify us immediately of any unauthorized access or suspected
                  breach.
                </li>
                <li>
                  You must provide accurate information and keep it up to date.
                </li>
              </ul>
            </div>

            <div className="px-6 pb-4">
              <h2 className="text-lg font-semibold text-white">
                Use of Service
              </h2>
              <ul className="list-disc pl-5 text-sm text-white/70 space-y-2">
                <li>
                  Do not use the platform for unlawful content or activities.
                </li>
                <li>
                  Do not attempt to disrupt, degrade, or bypass rate limits or
                  security.
                </li>
                <li>
                  Respect fair use constraints; excessive or abusive traffic may
                  be limited.
                </li>
              </ul>
            </div>

            <div className="px-6 pb-4">
              <h2 className="text-lg font-semibold text-white">
                Plans, Billing & Taxes
              </h2>
              <ul className="list-disc pl-5 text-sm text-white/70 space-y-2">
                <li>
                  Fees, quotas, and retention vary by plan, as shown on the
                  pricing page.
                </li>
                <li>
                  Paid plans are billed in advance unless stated otherwise.
                </li>
                <li>
                  You are responsible for applicable taxes and payment method
                  charges.
                </li>
              </ul>
            </div>

            <div className="px-6 pb-4">
              <h2 className="text-lg font-semibold text-white">
                Data & Intellectual Property
              </h2>
              <ul className="list-disc pl-5 text-sm text-white/70 space-y-2">
                <li>
                  You own your log data. Grant us the rights needed to store and
                  process it.
                </li>
                <li>
                  All service software, branding, and documentation are owned by
                  us.
                </li>
                <li>
                  Feedback may be used to improve the product without
                  obligation.
                </li>
              </ul>
            </div>

            <div className="px-6 pb-4">
              <h2 className="text-lg font-semibold text-white">Termination</h2>
              <p className="text-sm text-white/70!">
                You may stop using the service or delete your account at any
                time. We may suspend or terminate access for violations, abuse,
                or risks to the platform or users.
              </p>
            </div>

            <div className="px-6 pb-4">
              <h2 className="text-lg font-semibold text-white">
                Warranties & Liability
              </h2>
              <ul className="list-disc pl-5 text-sm text-white/70 space-y-2">
                <li>
                  The service is provided “as is” without warranties of any
                  kind.
                </li>
                <li>
                  To the extent permitted by law, our liability is limited to
                  fees paid for the current term.
                </li>
                <li>
                  We are not liable for indirect, incidental, or consequential
                  damages.
                </li>
              </ul>
            </div>

            <div className="px-6 pb-4">
              <h2 className="text-lg font-semibold text-white">
                Governing Law & Jurisdiction
              </h2>
              <p className="text-sm text-white/70!">
                These Terms and your use of OneMinute Logs are governed by the laws of the United States of America.
                Where relevant, applicable state laws may also apply. You agree that any dispute arising out of or
                relating to the service will be resolved in competent courts within the United States, and you consent
                to personal jurisdiction and venue in those courts.
              </p>
            </div>

            <div className="px-6 pb-4">
              <h2 className="text-lg font-semibold text-white">
                Changes & Contact
              </h2>
              <p className="text-sm text-white/70!">
                We may update these terms to reflect changes to the service.
                Continued use after updates indicates acceptance. For questions,
                contact support through the dashboard channels.
              </p>
            </div>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default Page;