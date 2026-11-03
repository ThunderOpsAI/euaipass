import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PRODUCT_SAFETY_GUIDES,
  getProductSafetyGuide,
} from "@/data/product-safety-data";
import { ScannerForm } from "@/components/scanner-form";
import { AdSlot } from "@/components/ad-slot";
import { ShieldCheck, CheckCircle2, FileText } from "lucide-react";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PRODUCT_SAFETY_GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getProductSafetyGuide(slug);
  if (!guide) return { title: "Guide Not Found" };

  return {
    title: `${guide.title} — EU Compliance Guide`,
    description: `${guide.heroSummary.slice(0, 155)}... Customs impact, checklist preview, and who must comply.`,
    alternates: {
      canonical: `/product-safety/${slug}`,
    },
  };
}

export default async function ProductSafetyDetailPage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getProductSafetyGuide(slug);
  if (!guide) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${guide.title} — EU Product Safety & Customs Compliance Guide`,
    description: guide.heroSummary,
    url: `https://euaipass.com/product-safety/${slug}`,
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
        <Link href="/product-safety" className="hover:underline">Product Safety</Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium">{guide.title}</span>
      </nav>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
            {guide.regulationRef}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Effective: {guide.effectiveDate}
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
          {guide.title}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-4xl">
          {guide.heroSummary}
        </p>
      </div>

      <AdSlot slot={`safety-${slug}-top`} format="horizontal" />

      {/* Who Must Comply Box */}
      <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20">
        <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 mb-1.5 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Who Must Comply
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {guide.whoMustComply}
        </p>
      </div>

      {/* Key Requirements Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          Key Statutory Requirements
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {guide.keyRequirements.map((req, i) => (
            <div key={i} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                {req.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {req.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Customs & Border Detention Impact */}
      <div className="p-5 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20">
        <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 mb-1.5 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-blue-600" />
          EU Customs & Border Inspection Impact
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {guide.customsAndBorderImpact}
        </p>
      </div>

      {/* Embedded Scanner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
          Scan Your Product Against {guide.regulationRef}
        </h3>
        <ScannerForm defaultDescription={`Physical product checked against ${guide.title}: `} />
      </div>

      {/* Actionable Checklist Preview */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <h2 className="text-base font-bold text-slate-950 dark:text-white mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Pre-Export Action Checklist
        </h2>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          {guide.checklistPreview.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-4 h-4 rounded border border-slate-300 dark:border-slate-700 text-blue-600 flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">
                {idx + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <AdSlot slot={`safety-${slug}-bot`} format="rectangle" />
    </div>
  );
}
