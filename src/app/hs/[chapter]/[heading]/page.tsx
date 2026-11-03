import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getHsHeading,
  getHsChapter,
  getCodesByHeading,
} from "@/data/hs-taxonomy";
import { ScannerForm } from "@/components/scanner-form";
import { AdSlot } from "@/components/ad-slot";
import { ArrowRight } from "lucide-react";

export const revalidate = 86400; // ISR cache
export const dynamicParams = true;

interface HeadingPageProps {
  params: Promise<{ chapter: string; heading: string }>;
}

export async function generateMetadata({ params }: HeadingPageProps): Promise<Metadata> {
  const { chapter, heading } = await params;
  const h = getHsHeading(chapter, heading);
  if (!h) return { title: "Heading Not Found" };

  return {
    title: `HS Heading ${h.heading}: ${h.title.slice(0, 60)} — WCO Subheadings`,
    description: `6-digit subheadings, WCO tariff notes, and EU customs rules for HS Heading ${h.heading} (${h.title}).`,
    alternates: {
      canonical: `/hs/${chapter}/${heading}`,
    },
  };
}

export default async function HeadingPage({ params }: HeadingPageProps) {
  const { chapter, heading } = await params;
  const ch = getHsChapter(chapter);
  const h = getHsHeading(chapter, heading);
  if (!ch || !h) notFound();

  const codes = getCodesByHeading(h.heading);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `HS Heading ${h.heading}: ${h.title} — WCO Subheadings & EU Classification`,
    description: `Browse 6-digit WCO subheadings for Heading ${h.heading} under Chapter ${ch.chapter}.`,
    url: `https://euaipass.com/hs/${ch.chapter}/${h.heading}`,
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

      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/hs" className="hover:underline">HS Directory</Link>
        <span>/</span>
        <Link href={`/hs/${ch.chapter}`} className="hover:underline">Chapter {ch.chapter}</Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium">Heading {h.heading}</span>
      </nav>

      <div>
        <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300">
          Chapter {ch.chapter}: {ch.title}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight mt-2">
          HS Heading {h.heading}: {h.title}
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Heading {h.heading} defines the 4-digit international customs category. Select any 6-digit subheading below to view the standard WCO tariff description, commercial invoice copy snippet, and applicable EU safety regulations.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
          Classify an Item Under Heading {h.heading}
        </h3>
        <ScannerForm defaultDescription={`Item under Heading ${h.heading} (${h.title.slice(0, 80)}): `} />
      </div>

      <AdSlot slot={`hs-heading-${h.heading}-mid`} format="horizontal" />

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          6-Digit HS Subheadings Under Heading {h.heading} ({codes.length} Codes)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {codes.map((c) => (
            <Link
              key={c.code}
              href={`/hs/code/${c.code}`}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-sm transition group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400">
                  HS {c.code}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-medium line-clamp-2">
                {c.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <AdSlot slot={`hs-heading-${h.heading}-bot`} format="rectangle" />
    </div>
  );
}
