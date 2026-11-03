import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getHsCodeEntry,
  getHsChapter,
  getCodesByHeading,
} from "@/data/hs-taxonomy";
import { ScannerForm } from "@/components/scanner-form";
import { AdSlot } from "@/components/ad-slot";
import { buildCommercialInvoiceSnippet } from "@/lib/scanner";
import { FileText, ShieldCheck } from "lucide-react";

export const revalidate = 86400; // ISR cache
export const dynamicParams = true;

interface CodePageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: CodePageProps): Promise<Metadata> {
  const { code } = await params;
  const entry = getHsCodeEntry(code);
  if (!entry) return { title: "HS Code Not Found" };

  return {
    title: `HS Code ${entry.code} Tariff Classification & EU Import Rules`,
    description: `Official WCO description, EU customs declaration requirements, €150 IOSS threshold, and GPSR safety rules for HS ${entry.code} (${entry.shortDescription}).`,
    alternates: {
      canonical: `/hs/code/${entry.code}`,
    },
  };
}

export default async function HsCodePage({ params }: CodePageProps) {
  const { code } = await params;
  const entry = getHsCodeEntry(code);
  if (!entry) notFound();

  const ch = getHsChapter(entry.chapter);
  const siblings = getCodesByHeading(entry.heading).filter((s) => s.code !== entry.code);
  const invoiceSnippet = buildCommercialInvoiceSnippet(entry.code, entry.description);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `HS Code ${entry.code}`,
    description: entry.description,
    category: `Harmonized System Chapter ${entry.chapter}`,
    identifier: entry.code,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
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
        <Link href={`/hs/${entry.chapter}`} className="hover:underline">Chapter {entry.chapter}</Link>
        <span>/</span>
        <Link href={`/hs/${entry.chapter}/${entry.heading}`} className="hover:underline">Heading {entry.heading}</Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium">HS {entry.code}</span>
      </nav>

      {/* Main Title & Code Banner */}
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300">
            6-Digit WCO Subheading
          </span>
          <span className="text-xs text-slate-500">
            Chapter {entry.chapter}: {ch?.title || "Customs Tariff"}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
          HS Code <span className="font-mono text-blue-600">{entry.code}</span>
        </h1>
        <p className="mt-2 text-base sm:text-lg text-slate-800 dark:text-slate-200 font-medium max-w-4xl leading-relaxed">
          {entry.description}
        </p>
      </div>

      {/* Top Banner AdSlot (Ensures CLS < 0.1 via reserved min-height) */}
      <AdSlot slot={`hs-code-${entry.code.replace(".", "")}-top`} format="horizontal" />

      {/* Commercial Invoice Template */}
      <div className="rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            Commercial Invoice Snippet for HS {entry.code}
          </h2>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
          Copy and paste this standard customs declaration block directly into your carrier manifest (DHL, FedEx, UPS) or Shopify export documentation:
        </p>
        <pre className="text-xs font-mono bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
          {invoiceSnippet}
        </pre>
      </div>

      {/* EU Regulatory & GPSR Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h2 className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            EU GPSR & Product Safety Context
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
            Physical items classified under HS {entry.code} targeting consumers in the EU are subject to the EU General Product Safety Regulation (GPSR) (EU) 2023/988:
          </p>
          <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc list-inside">
            <li>Mandatory EU Responsible Person postal & electronic address (Article 16).</li>
            <li>Physical batch, serial, or model identifier on the packaging.</li>
            <li>Online marketplace listing disclosure of safety contacts & warnings.</li>
            {ch?.dppRelevant && (
              <li className="font-semibold text-emerald-600 dark:text-emerald-400">
                ESPR Digital Product Passport (DPP) priority candidate category.
              </li>
            )}
          </ul>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h2 className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-600" />
            EU ICS2 & €150 IOSS Threshold Guidance
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Under EU Import Control System 2 (ICS2), declaring HS {entry.code} electronically is required before flight/vessel loading. Parcels ≤ €150 intrinsic value enter duty-free under IOSS when destination VAT is collected at checkout. Consignments &gt; €150 require standard TARIC duty and import VAT calculation.
          </p>
        </div>
      </div>

      {/* Embedded Live Scanner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
          Verify if Your Specific SKU Matches HS {entry.code}
        </h3>
        <ScannerForm defaultDescription={`Product intended for classification under HS ${entry.code} (${entry.shortDescription}): `} />
      </div>

      {/* Sibling Codes */}
      {siblings.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Related Subheadings in Heading {entry.heading}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {siblings.map((sib) => (
              <Link
                key={sib.code}
                href={`/hs/code/${sib.code}`}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 text-xs transition"
              >
                <div className="font-mono font-bold text-blue-600 dark:text-blue-400 mb-1">
                  HS {sib.code}
                </div>
                <div className="text-slate-700 dark:text-slate-300 line-clamp-2">
                  {sib.shortDescription}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bottom AdSlot */}
      <AdSlot slot={`hs-code-${entry.code.replace(".", "")}-bot`} format="rectangle" />
    </div>
  );
}
