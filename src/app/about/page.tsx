import React from "react";
import type { Metadata } from "next";
import { Target, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "About EUPass — Free EU Trade & AI Compliance Hub",
  description:
    "Learn about EUPass: our mission to simplify EU market entry compliance for global sellers, our in-memory privacy architecture, and our editorial standards.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div>
        <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300">
          Editorial & Mission
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight mt-2">
          About EUPass
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          EUPass is a free, ad-supported regulatory intelligence portal created to answer one critical question for founders, cross-border e-commerce brands, and developers: <strong>&quot;Can I sell or ship this product into the European Union, and what do I need to do?&quot;</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Target className="w-6 h-6 text-blue-600 mb-2" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Our Mission</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            European regulatory frameworks—from the EU AI Act (2024/1689) and GPSR (2023/988) to WCO Customs HS codes and Digital Product Passports—are complex and fragmented. We bridge them into one unified, free screening tool.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Lock className="w-6 h-6 text-emerald-600 mb-2" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Strict In-Memory Privacy</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            We never store, log, or persist the product specifications or prompts you enter. Everything is evaluated transiently in memory, ensuring complete confidentiality for proprietary product roadmaps.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <h2 className="text-base font-bold text-slate-950 dark:text-white">How EUPass Works</h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          When you enter a product description or upload an image, EUPass passes your description through our 3-step pipeline:
        </p>
        <ol className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-2 list-decimal list-inside">
          <li><strong>Intake Router:</strong> Identifies whether the item is a physical good, standalone digital software, or physical hardware with embedded AI.</li>
          <li><strong>HS Tariff Retrieval:</strong> For physical goods, queries our 5,756-code WCO Harmonized System vector index to locate the closest 6-digit tariff subheadings and assess confidence tiers.</li>
          <li><strong>Single-Pass AI Evaluation:</strong> A unified Google Gemini pass determines the exact EU AI Act risk tier (Article 5 / Annex I / Annex III), GPSR EU Responsible Person mandate, and outputs an actionable checklist.</li>
        </ol>
      </div>

      <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-950/60 bg-amber-50/30 dark:bg-amber-950/20 text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
        <strong>Editorial Independence:</strong> EUPass is an independent information service and is not affiliated with, endorsed by, or sponsored by the European Commission, the European Parliament, or the World Customs Organization.
      </div>
    </div>
  );
}
