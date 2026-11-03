import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllProductSafetyGuides } from "@/data/product-safety-data";
import { ScannerForm } from "@/components/scanner-form";
import { AdSlot } from "@/components/ad-slot";
import { ShieldCheck, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "EU Product Safety, GPSR & CE Directives Guide Hub",
  description:
    "Comprehensive guides for selling physical goods in the EU: General Product Safety Regulation (GPSR 2023/988), EU Responsible Person mandate, CE marking, and Digital Product Passports.",
  alternates: { canonical: "/product-safety" },
};

export default function ProductSafetyIndexPage() {
  const guides = getAllProductSafetyGuides();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium">Product Safety & GPSR</span>
      </nav>

      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>EU Harmonization & Consumer Protection Hub</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight">
          EU Product Safety, GPSR & CE Directives
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
          The European Single Market imposes strict physical product safety rules on non-EU sellers and distance merchants. Since 13 December 2024, the GPSR requires an appointed EU Responsible Person for virtually all consumer goods. Browse our guides to ensure seamless EU customs clearance.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
          Check Your Product for GPSR, CE & DPP Triggers
        </h2>
        <ScannerForm defaultDescription="Physical consumer product description: " />
      </div>

      <AdSlot slot="product-safety-top" format="horizontal" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/product-safety/${g.slug}`}
            className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500 transition group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 dark:text-emerald-400">
                  {g.regulationRef.split("&")[0].trim()}
                </span>
                <span className="text-[10px] text-slate-400">{g.effectiveDate.split("(")[0].trim()}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition mb-2">
                {g.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                {g.heroSummary}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Read Guide</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </div>
          </Link>
        ))}
      </div>

      <AdSlot slot="product-safety-bot" format="rectangle" />
    </div>
  );
}
