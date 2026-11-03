import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllHsChapters } from "@/data/hs-taxonomy";
import { ScannerForm } from "@/components/scanner-form";
import { AdSlot } from "@/components/ad-slot";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "WCO Harmonized System (HS) Tariff Directory — All 96 Chapters",
  description:
    "Complete searchable directory of all 96 WCO Harmonized System chapters for EU customs clearance, TARIC duty lookup, and GPSR compliance.",
  alternates: { canonical: "/hs" },
};

export default function HsDirectoryPage() {
  const chapters = getAllHsChapters();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium">HS Tariff Directory</span>
      </nav>

      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
          Harmonized System (HS) Customs Tariff Directory
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          The international Harmonized System (HS) governs global trade across 5,000+ commodity groups. Browse all 96 active chapters below to explore 4-digit headings, 6-digit WCO subheadings, and applicable EU GPSR & CE product safety directives.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
          Classify Your Product Instantly with AI
        </h2>
        <ScannerForm />
      </div>

      <AdSlot slot="hs-index-top" format="horizontal" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {chapters.map((ch) => (
          <Link
            key={ch.chapter}
            href={`/hs/${ch.chapter}`}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                Chapter {ch.chapter}
              </span>
              <span className="text-[10px] text-slate-400">Section {ch.sectionRoman}</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-2">
              {ch.title}
            </h3>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
              <span>{ch.dppRelevant ? "ESPR DPP Priority" : "Standard GPSR"}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </div>
          </Link>
        ))}
      </div>

      <AdSlot slot="hs-index-bottom" format="rectangle" />
    </div>
  );
}
