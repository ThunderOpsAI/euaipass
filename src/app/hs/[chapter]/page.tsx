import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllHsChapters,
  getHsChapter,
  getHeadingsByChapter,
} from "@/data/hs-taxonomy";
import { ScannerForm } from "@/components/scanner-form";
import { AdSlot } from "@/components/ad-slot";
import { ArrowRight, ShieldCheck, FileText } from "lucide-react";

export const revalidate = 86400; // ISR cache for 24h
export const dynamicParams = true;

interface ChapterPageProps {
  params: Promise<{ chapter: string }>;
}

export async function generateStaticParams() {
  return getAllHsChapters().map((c) => ({
    chapter: c.chapter,
  }));
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { chapter } = await params;
  const info = getHsChapter(chapter);
  if (!info) return { title: "Chapter Not Found" };

  return {
    title: `HS Chapter ${info.chapter}: ${info.title} — EU Customs & GPSR Guide`,
    description: `Complete WCO classification, EU import requirements, GPSR traceability, and 4-digit headings under HS Chapter ${info.chapter} (${info.title}).`,
    alternates: {
      canonical: `/hs/${info.chapter}`,
    },
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { chapter } = await params;
  const info = getHsChapter(chapter);
  if (!info) notFound();

  const headings = getHeadingsByChapter(info.chapter);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `HS Chapter ${info.chapter}: ${info.title} — EU Customs & Product Safety Guide`,
    description: info.euRegulatorySummary,
    url: `https://euaipass.com/hs/${info.chapter}`,
    publisher: {
      "@type": "Organization",
      name: "EUPass",
      url: "https://euaipass.com",
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/hs" className="hover:underline">HS Directory</Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium">Chapter {info.chapter}</span>
      </nav>

      {/* Chapter Title & Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300">
            Section {info.sectionRoman}: {info.sectionTitle}
          </span>
          {info.dppRelevant && (
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
              ESPR DPP Priority Group
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
          HS Chapter {info.chapter}: {info.title}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
          {info.euRegulatorySummary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h2 className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Applicable EU Safety & Environmental Directives
          </h2>
          <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc list-inside">
            {info.likelyDirectives.map((dir, i) => (
              <li key={i}>{dir}</li>
            ))}
          </ul>
        </div>
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h2 className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-600" />
            EU Import & IOSS Threshold Rules
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Consignments with an intrinsic value ≤ €150 qualify for Import One-Stop Shop (IOSS) green-channel clearance and 0% customs duty relief. Shipments &gt; €150 require standard TARIC customs declaration and duty assessment under the Union Customs Code.
          </p>
        </div>
      </div>

      {/* Embedded Scanner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
          Classify a Specific Item in Chapter {info.chapter}
        </h3>
        <ScannerForm defaultDescription={`Product falling under Chapter ${info.chapter} (${info.title}): `} />
      </div>

      <AdSlot slot={`hs-chapter-${info.chapter}-mid`} format="horizontal" />

      {/* Headings List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          4-Digit Tariff Headings Under Chapter {info.chapter} ({headings.length} Headings)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {headings.map((h) => (
            <Link
              key={h.heading}
              href={`/hs/${info.chapter}/${h.heading}`}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-sm transition group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                  Heading {h.heading}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
                {h.title}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <AdSlot slot={`hs-chapter-${info.chapter}-bot`} format="rectangle" />
    </div>
  );
}
