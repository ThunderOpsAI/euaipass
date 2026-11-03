"use client";

import React from "react";
import { useConsent } from "@/lib/consent";
import { ShieldCheck, Cookie } from "lucide-react";
import Link from "next/link";

export function ConsentBanner() {
  const { consent, acceptAll, rejectAll } = useConsent();

  if (consent.hasAnswered) {
    return null;
  }

  return (
    <div
      data-testid="consent-banner"
      role="region"
      aria-label="Privacy and Cookie Consent"
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
            <Cookie className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white mb-1">
              EU Privacy & Consent Mode v2 Notice
            </p>
            <p className="leading-relaxed">
              EUPass is a free service supported by contextual advertising. We and our partner Google use cookies to personalize ads and analyze site traffic pursuant to GDPR and the ePrivacy Directive. Raw product descriptions you submit for scanning are processed in volatile memory only and are never retained. Learn more in our{" "}
              <Link href="/privacy" className="text-blue-600 dark:text-blue-400 underline font-medium">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <button
            onClick={rejectAll}
            className="flex-1 md:flex-none px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
          >
            Reject Non-Essential
          </button>
          <button
            onClick={acceptAll}
            className="flex-1 md:flex-none px-5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
