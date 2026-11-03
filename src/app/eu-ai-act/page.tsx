import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ARTICLE_5_PRACTICES,
  ANNEX_III_CATEGORIES,
  ANNEX_I_AREAS,
} from "@/data/ai-act-data";
import { ScannerForm } from "@/components/scanner-form";
import { AdSlot } from "@/components/ad-slot";
import { Sparkles, ArrowRight, ShieldAlert, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "EU AI Act (Regulation (EU) 2024/1689) Compliance Hub & Risk Matrix",
  description:
    "Complete statutory reference and classification matrix for EU AI Act Article 5 prohibited practices, Annex III high-risk domains, and Annex I CE harmonized safety rules.",
  alternates: { canonical: "/eu-ai-act" },
};

export default function AiActIndexPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium">EU AI Act Hub</span>
      </nav>

      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Regulation (EU) 2024/1689 Reference Center</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight">
          EU AI Act Risk Tiers & Statutory Guides
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
          The EU Artificial Intelligence Act entered into force on 1 August 2024. Article 5 bans took effect on 2 February 2025, and Annex III High-Risk obligations apply from 2 August 2026. Explore all statutory provisions, obligations, and penalties below.
        </p>
      </div>

      {/* Embedded Scanner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
          Test Your AI System Against EU AI Act Provisions
        </h2>
        <ScannerForm defaultDescription="AI software description: " />
      </div>

      <AdSlot slot="ai-act-index-top" format="horizontal" />

      {/* Article 5 Prohibited Practices */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-600" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Article 5: Prohibited AI Practices (Unacceptable Risk — In Force)
          </h2>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Penalties up to €35,000,000 or 7% of worldwide annual turnover for placement or operation in the EU.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ARTICLE_5_PRACTICES.map((p) => (
            <Link
              key={p.slug}
              href={`/eu-ai-act/article-5/${p.slug}`}
              className="p-4 rounded-xl border border-red-200 dark:border-red-950/60 bg-red-50/20 dark:bg-red-950/10 hover:border-red-500 transition group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-red-700 dark:text-red-400">
                  {p.articleRef}
                </span>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white mt-1 group-hover:text-red-600 transition">
                  {p.title}
                </h3>
              </div>
              <div className="mt-3 text-[11px] font-semibold text-red-600 flex items-center justify-between">
                <span>Banned in EU</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Annex III High Risk Categories */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Annex III: High-Risk Standalone Domains (Article 6(2))
          </h2>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Mandatory Article 9–17 conformity, Annex IV technical dossiers, and EU AI Database registration (August 2026).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ANNEX_III_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/eu-ai-act/annex-iii/${cat.slug}`}
              className="p-4 rounded-xl border border-amber-200 dark:border-amber-950/60 bg-amber-50/20 dark:bg-amber-950/10 hover:border-amber-500 transition group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400">
                  {cat.articleRef}
                </span>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white mt-1 group-hover:text-amber-600 transition">
                  {cat.title}
                </h3>
              </div>
              <div className="mt-3 text-[11px] font-semibold text-amber-700 dark:text-amber-400 flex items-center justify-between">
                <span>High Risk Controls</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Annex I Harmonized Product Safety */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Annex I: AI Safety Components in CE-Harmonized Products (Article 6(1))
          </h2>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          AI safety features embedded in physical machinery, toys, medical devices, and connected IoT (August 2027).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ANNEX_I_AREAS.map((area) => (
            <Link
              key={area.slug}
              href={`/eu-ai-act/annex-i/${area.slug}`}
              className="p-4 rounded-xl border border-purple-200 dark:border-purple-950/60 bg-purple-50/20 dark:bg-purple-950/10 hover:border-purple-500 transition group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-purple-700 dark:text-purple-400">
                  {area.articleRef}
                </span>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white mt-1 group-hover:text-purple-600 transition">
                  {area.title}
                </h3>
              </div>
              <div className="mt-3 text-[11px] font-semibold text-purple-700 dark:text-purple-400 flex items-center justify-between">
                <span>Unified CE + AI Act</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <AdSlot slot="ai-act-index-bot" format="rectangle" />
    </div>
  );
}
