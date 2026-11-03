"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ScannerForm } from "@/components/scanner-form";
import { ResultView } from "@/components/result-view";
import { AdSlot } from "@/components/ad-slot";
import type { EuPassScanResult } from "@/lib/schema";
import {
  ShieldCheck,
  Sparkles,
  Globe2,
  CheckCircle,
} from "lucide-react";

function getInitialScanResult(): EuPassScanResult | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("eupass_active_scan");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return null;
}

export default function HomePage() {
  const [activeResult, setActiveResult] = useState<EuPassScanResult | null>(() => getInitialScanResult());

  const handleReset = () => {
    setActiveResult(null);
    try {
      localStorage.removeItem("eupass_active_scan");
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-8 sm:pt-16 sm:pb-12 bg-gradient-to-b from-blue-50/60 via-white to-slate-50 dark:from-blue-950/20 dark:via-slate-950 dark:to-slate-950 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 text-xs font-semibold mb-4 border border-blue-300/40">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Unified European Market Entry & Regulatory Screener</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Can I Sell or Ship This Product Into the EU?
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Instant 3-pillar compliance check in one scan: Harmonized Customs (HS) codes, EU AI Act risk tiering, and General Product Safety Regulation (GPSR / CE).
          </p>

          {/* Quick Pillar Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-medium">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              6-Digit Customs HS RAG
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              EU AI Act (Annex I / III / Art 5)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              GPSR, CE & DPP Safety Rules
            </span>
          </div>
        </div>
      </section>

      {/* Main Intake Form or Active Result */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        {activeResult ? (
          <div id="results" className="scroll-mt-8">
            <ResultView result={activeResult} onReset={handleReset} />
          </div>
        ) : (
          <div className="space-y-8">
            <ScannerForm
              onScanComplete={(result) => {
                setActiveResult(result);
                try {
                  localStorage.setItem("eupass_active_scan", JSON.stringify(result));
                } catch {
                  // ignore
                }
              }}
            />

            {/* Top Ad placement */}
            <div className="pt-4">
              <AdSlot slot="homepage-hero-bottom" format="horizontal" />
            </div>
          </div>
        )}
      </section>

      {/* Value Prop & Guide Hub Previews */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Comprehensive Single-Window EU Market Access
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Everything non-EU exporters and digital software vendors need before clearing European borders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-4 font-bold">
                HS
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Customs & Tariff Classification
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Ground your classification across 5,700+ 6-digit Harmonized System codes. Generates ready-to-paste commercial invoice descriptions and checks the €150 IOSS threshold.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/hs"
                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                Browse HS Taxonomy Directory →
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-700 dark:text-indigo-400 mb-4 font-bold">
                AI
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                EU AI Act Risk Classification
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Identify if your software or smart hardware triggers Article 5 bans, Annex III high-risk standalone obligations, or Annex I harmonized CE machinery rules.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/eu-ai-act"
                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                Browse AI Act Risk Matrix →
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700 dark:text-amber-400 mb-4 font-bold">
                CE
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Product Safety & GPSR (2023/988)
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Mandatory EU Responsible Person requirements, manufacturer labelling, traceability passports, and digital product passport (DPP) roadmaps.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/product-safety"
                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                Read Safety & GPSR Guides →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Ad placement */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <AdSlot slot="homepage-bottom" format="horizontal" />
      </section>
    </div>
  );
}
