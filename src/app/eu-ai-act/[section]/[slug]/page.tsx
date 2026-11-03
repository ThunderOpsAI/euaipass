import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ARTICLE_5_PRACTICES,
  ANNEX_III_CATEGORIES,
  ANNEX_I_AREAS,
  getAiActPage,
} from "@/data/ai-act-data";
import { ScannerForm } from "@/components/scanner-form";
import { AdSlot } from "@/components/ad-slot";

interface AiActSubPageProps {
  params: Promise<{ section: string; slug: string }>;
}

export async function generateStaticParams() {
  const params: Array<{ section: string; slug: string }> = [];
  for (const p of ARTICLE_5_PRACTICES) params.push({ section: "article-5", slug: p.slug });
  for (const p of ANNEX_III_CATEGORIES) params.push({ section: "annex-iii", slug: p.slug });
  for (const p of ANNEX_I_AREAS) params.push({ section: "annex-i", slug: p.slug });
  return params;
}

export async function generateMetadata({ params }: AiActSubPageProps): Promise<Metadata> {
  const { section, slug } = await params;
  const page = getAiActPage(section, slug);
  if (!page) return { title: "AI Act Guide Not Found" };

  return {
    title: `${page.articleRef}: ${page.title} — EU AI Act Guide`,
    description: `${page.summary.slice(0, 155)}... Penalties, scope, technical examples, and compliance obligations.`,
    alternates: {
      canonical: `/eu-ai-act/${section}/${slug}`,
    },
  };
}

export default async function AiActSubPage({ params }: AiActSubPageProps) {
  const { section, slug } = await params;
  const page = getAiActPage(section, slug);
  if (!page) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${page.articleRef}: ${page.title} — EU AI Act Compliance Guide`,
    description: page.summary,
    url: `https://euaipass.com/eu-ai-act/${section}/${slug}`,
    publisher: {
      "@type": "Organization",
      name: "EUPass",
      url: "https://euaipass.com",
    },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/eu-ai-act" className="hover:underline">EU AI Act</Link>
        <span>/</span>
        <span className="uppercase text-slate-400">{section.replace("-", " ")}</span>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium">{page.title}</span>
      </nav>

      {/* Hero Header */}
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300">
            {page.articleRef}
          </span>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              page.riskTier === "Unacceptable"
                ? "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300"
                : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
            }`}
          >
            {page.riskTier} Risk
          </span>
          <span className="text-xs text-slate-500 ml-auto font-medium">
            Enforcement: {page.enforcementDeadline}
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
          {page.title}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-4xl">
          {page.summary}
        </p>
      </div>

      <AdSlot slot={`ai-act-${slug}-top`} format="horizontal" />

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Statutory Non-Compliance Penalty
          </span>
          <p className="text-sm font-bold text-red-600 dark:text-red-400 mt-1">
            {page.maxPenalty}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Full Enforcement Timeline
          </span>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
            {page.enforcementDeadline}
          </p>
        </div>
      </div>

      {/* Statutory Scope & Examples */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-1.5">
            Statutory Scope & Legal Trigger Criteria
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {page.statutoryScope}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2">
            Technical & Product Examples
          </h2>
          <ul className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1.5 list-disc list-inside">
            {page.technicalExamples.map((ex, i) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Embedded Scanner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
          Verify if Your AI Architecture Triggers {page.articleRef}
        </h3>
        <ScannerForm defaultDescription={`AI system evaluated against ${page.articleRef} (${page.title}): `} />
      </div>

      {/* Mandatory Statutory Obligations */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-950 dark:text-white">
          Mandatory Compliance Actions & Safeguards
        </h2>
        <div className="space-y-3">
          {page.obligations.map((ob, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-[11px] font-mono font-bold text-purple-600 dark:text-purple-400">
                {ob.article}
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {ob.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {ob.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Exemptions Box */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-1">
          Statutory Exemptions & Narrow Boundaries
        </h3>
        <p>{page.exemptionsAndEdgeCases}</p>
      </div>

      <AdSlot slot={`ai-act-${slug}-bot`} format="rectangle" />
    </div>
  );
}
