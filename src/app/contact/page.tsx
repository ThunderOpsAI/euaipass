import React from "react";
import type { Metadata } from "next";
import { Mail, MessageSquare, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Editorial Office — EUPass",
  description:
    "Contact the EUPass editorial team for regulatory corrections, partnership inquiries, or advertising questions.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-slate-800 dark:text-slate-200">
      <div>
        <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight mt-2">
          Contact & Editorial Inquiries
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
          Have feedback on an HS classification, a suggestion for our EU AI Act guides, or an inquiry regarding partnership and advertising? Contact our team below.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Mail className="w-5 h-5 text-blue-600 mb-2" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Editorial & Feedback</h2>
          <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
            editorial@euaipass.com
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Regulatory corrections and tariff updates.</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <MessageSquare className="w-5 h-5 text-emerald-600 mb-2" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Partnerships</h2>
          <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
            partners@euaipass.com
          </p>
          <p className="text-[11px] text-slate-500 mt-1">EU Responsible Person & customs services.</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <MapPin className="w-5 h-5 text-purple-600 mb-2" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Location</h2>
          <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
            European Single Market
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Dublin, Ireland & Frankfurt, Germany.</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-200">
              Is EUPass completely free?
            </h3>
            <p className="mt-0.5">
              Yes. All HS code classifications, EU AI Act evaluations, GPSR guides, and PDF report downloads are 100% free, supported by advertising.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-200">
              Do you store the product descriptions I submit?
            </h3>
            <p className="mt-0.5">
              No. Inputs are processed strictly in volatile memory and never saved to a database or storage disk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
