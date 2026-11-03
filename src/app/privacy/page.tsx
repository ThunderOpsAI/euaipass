import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy & Cookie Disclosures — EUPass",
  description:
    "EUPass Privacy Policy: zero retention of user scan inputs, Google AdSense cookies, Consent Mode v2 implementation, and GDPR rights.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-slate-800 dark:text-slate-200">
      <div>
        <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300">
          GDPR & ePrivacy Compliance
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight mt-2">
          Privacy Policy & Cookie Disclosures
        </h1>
        <p className="mt-2 text-xs text-slate-500">
          Last Updated & Effective: 1 October 2026
        </p>
      </div>

      <section className="space-y-3 text-xs sm:text-sm leading-relaxed">
        <h2 className="text-base font-bold text-slate-950 dark:text-white">
          1. Fundamental In-Memory Privacy Guarantee
        </h2>
        <p>
          At EUPass (<Link href="/" className="text-blue-600 underline">https://euaipass.com</Link>), we operate under a strict <strong>zero raw input retention policy</strong>:
        </p>
        <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
          <li>Product descriptions, text prompts, and uploaded product images you submit for scanning are processed strictly in volatile RAM.</li>
          <li>We <strong>never persist, store, or log</strong> your raw inputs to a database, cloud storage, or third-party training repositories.</li>
          <li>Once our AI pipeline generates your compliance dossier, the raw input is discarded immediately from memory.</li>
        </ul>
      </section>

      <section className="space-y-3 text-xs sm:text-sm leading-relaxed">
        <h2 className="text-base font-bold text-slate-950 dark:text-white">
          2. Google AdSense & Third-Party Cookies
        </h2>
        <p>
          EUPass is a free service supported by contextual advertising served by Google AdSense:
        </p>
        <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
          <li>Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites.</li>
          <li>Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visits to our site and/or other sites on the Internet.</li>
          <li>Users in the European Economic Area (EEA), UK, and Switzerland are presented with our Consent Mode v2 banner upon first visit, giving you full control to accept or reject non-essential advertising and analytics cookies.</li>
          <li>You may also opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google Ads Settings</a> or <a href="https://aboutads.info" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">aboutads.info</a>.</li>
        </ul>
      </section>

      <section className="space-y-3 text-xs sm:text-sm leading-relaxed">
        <h2 className="text-base font-bold text-slate-950 dark:text-white">
          3. Google Consent Mode v2 & CMP Integration
        </h2>
        <p>
          We implement Google Consent Mode v2. By default, before user interaction with our consent banner, all advertising signals (<code>ad_storage</code>, <code>ad_user_data</code>, <code>ad_personalization</code>) and analytics signals (<code>analytics_storage</code>) default to <code>denied</code>. Ad slots only initialize active tags once consent has been explicitly granted.
        </p>
      </section>

      <section className="space-y-3 text-xs sm:text-sm leading-relaxed">
        <h2 className="text-base font-bold text-slate-950 dark:text-white">
          4. Local Storage
        </h2>
        <p>
          We use browser <code>localStorage</code> solely on the client-side to save your active scan result, checklist progress, and cookie consent preferences so that your progress is preserved when you reload the page. This data never leaves your browser.
        </p>
      </section>

      <section className="space-y-3 text-xs sm:text-sm leading-relaxed">
        <h2 className="text-base font-bold text-slate-950 dark:text-white">
          5. GDPR Rights & Contact
        </h2>
        <p>
          Under Regulation (EU) 2016/679 (GDPR), European users have the right to access, rectify, or erase personal data. Because we do not maintain user accounts or retain user inputs, we do not store identifiable personal data. For privacy inquiries, contact us at <code>privacy@euaipass.com</code>.
        </p>
      </section>
    </div>
  );
}
