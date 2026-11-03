import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service & Disclaimer — EUPass",
  description:
    "EUPass Terms of Service: terms of use, informational disclaimers, no legal or customs advice, and limitation of liability.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-slate-800 dark:text-slate-200">
      <div>
        <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300">
          User Agreement
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight mt-2">
          Terms of Service
        </h1>
        <p className="mt-2 text-xs text-slate-500">
          Effective: 1 October 2026
        </p>
      </div>

      <section className="space-y-3 text-xs sm:text-sm leading-relaxed">
        <h2 className="text-base font-bold text-slate-950 dark:text-white">
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing or using EUPass (<Link href="/" className="text-blue-600 underline">https://euaipass.com</Link>), you agree to be bound by these Terms of Service. If you do not agree, do not use the website or its automated screening tools.
        </p>
      </section>

      <section className="space-y-3 text-xs sm:text-sm leading-relaxed">
        <h2 className="text-base font-bold text-slate-950 dark:text-white">
          2. No Legal Counsel, Customs Brokerage or Conformity Guarantee
        </h2>
        <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 text-amber-950 dark:text-amber-200 font-medium">
          CRITICAL STATUTORY DISCLAIMER: EUPass is an automated decision-support and screening aid provided for informational purposes only. Outputs do not constitute binding legal advice, formal customs brokerage, Binding Tariff Information (BTI), or an authorized Notified Body conformity certificate under EU harmonization law.
        </div>
        <p>
          You acknowledge that customs authorities (including EU Member State customs administrations and market surveillance bodies) retain sole statutory authority to classify goods and determine product compliance. You must consult qualified legal counsel and licensed customs brokers before commercial shipping.
        </p>
      </section>

      <section className="space-y-3 text-xs sm:text-sm leading-relaxed">
        <h2 className="text-base font-bold text-slate-950 dark:text-white">
          3. Fair Use & Rate Limiting
        </h2>
        <p>
          EUPass provides free scans subject to automated per-IP hourly rate limits and a global daily cap. Automated scraping, bulk automated querying, or circumvention of bot verification challenges is strictly prohibited.
        </p>
      </section>

      <section className="space-y-3 text-xs sm:text-sm leading-relaxed">
        <h2 className="text-base font-bold text-slate-950 dark:text-white">
          4. Limitation of Liability
        </h2>
        <p>
          To the maximum extent permitted by applicable law, EUPass and its operators shall not be liable for any direct, indirect, incidental, or consequential damages resulting from customs delays, border detentions, tariff misclassifications, or regulatory penalties incurred by users.
        </p>
      </section>
    </div>
  );
}
