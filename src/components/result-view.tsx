"use client";

import React, { useState } from "react";
import type { EuPassScanResult } from "@/lib/schema";
import { getPartnerBySlot } from "@/config/partners";
import {
  FileText,
  Download,
  Copy,
  Check,
  Shield,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
} from "lucide-react";
import { Disclaimer } from "./disclaimer";

interface ResultViewProps {
  result: EuPassScanResult;
  onReset?: () => void;
}

export function ResultView({ result, onReset }: ResultViewProps) {
  const [copiedInvoice, setCopiedInvoice] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const storageKey = `eupass_checklist_${result.scan_id}`;

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return {};
  });

  const toggleCheck = (id: string) => {
    const updated = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleCopyInvoice = async () => {
    if (!result.commercial_invoice_snippet) return;
    try {
      await navigator.clipboard.writeText(result.commercial_invoice_snippet);
      setCopiedInvoice(true);
      setTimeout(() => setCopiedInvoice(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result }),
      });
      if (!res.ok) throw new Error("PDF download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `EUPass-Compliance-Report-${result.scan_id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const hasCustoms = Boolean(result.hs);
  const hasAiAct = Boolean(result.ai_act);
  const hasSafety = Boolean(result.product_safety);

  return (
    <div data-testid="eupass-result-view" className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-5 sm:p-7 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300">
                Route: {result.product_type}
              </span>
              <span className="text-xs text-slate-500 font-mono">ID: {result.scan_id}</span>
              <span className="text-xs text-slate-500 font-mono">Verified: {result.verified_date}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
              EU Market Entry Compliance Dossier
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
              {result.product_summary}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {onReset && (
              <button
                onClick={onReset}
                className="px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                New Scan
              </button>
            )}
            <button
              onClick={handleDownloadPdf}
              data-testid="download-pdf-btn"
              disabled={isDownloadingPdf}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloadingPdf ? "Compiling PDF..." : "Free PDF Export"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Pillar Cards: Render ONLY what applies */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Pillar 1: Customs Card */}
        {hasCustoms && result.hs && (
          <div
            data-testid="pillar-customs-card"
            className="rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  Customs & HS Tariff
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    result.hs.confidence_tier === "high"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                  }`}
                >
                  {result.hs.confidence_tier} Confidence
                </span>
              </div>
              <div className="mb-3">
                <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                  HS {result.hs.code}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1">
                  {result.hs.description}
                </p>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                {result.hs.rationale}
              </p>
              {result.hs.review_recommended && (
                <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-1.5 mb-3">
                  <HelpCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>Customs broker verification recommended before major commercial export.</span>
                </div>
              )}
            </div>

            {/* Copyable Commercial Invoice Snippet */}
            {result.commercial_invoice_snippet && (
              <div className="mt-3 pt-3 border-t border-blue-200/80 dark:border-blue-900/60">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase text-slate-700 dark:text-slate-300">
                    Commercial Invoice Snippet
                  </span>
                  <button
                    onClick={handleCopyInvoice}
                    data-testid="copy-invoice-btn"
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedInvoice ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-[10px] leading-relaxed font-mono bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {result.commercial_invoice_snippet}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Pillar 2: AI Act Card */}
        {hasAiAct && result.ai_act && (
          <div
            data-testid="pillar-ai-act-card"
            className="rounded-2xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/30 dark:bg-purple-950/20 p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  EU AI Act Tier
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    result.ai_act.risk_tier === "Unacceptable"
                      ? "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300"
                      : result.ai_act.risk_tier === "High"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                  }`}
                >
                  {result.ai_act.risk_tier} Risk
                </span>
              </div>
              <div className="mb-3">
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {result.ai_act.matched_category}
                </div>
                <div className="text-xs font-mono font-semibold text-purple-700 dark:text-purple-300 mt-0.5">
                  {result.ai_act.matched_article} • {result.ai_act.annex_scope}
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                {result.ai_act.rationale}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-purple-100/50 dark:bg-purple-900/30 text-[11px] text-purple-900 dark:text-purple-200">
              {result.ai_act.risk_tier === "High"
                ? "Annex IV technical dossier, QMS, and EU AI Database registration mandatory before EU deployment."
                : result.ai_act.risk_tier === "Unacceptable"
                ? "System falls under banned Article 5 practices; prohibited from EU deployment."
                : "Standard Article 4 literacy and Article 50 transparency disclosures apply."}
            </div>
          </div>
        )}

        {/* Pillar 3: Product Safety Card */}
        {hasSafety && result.product_safety && (
          <div
            data-testid="pillar-product-safety-card"
            className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  Product Safety & DPP
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {result.product_safety.dpp_espr_flag ? "ESPR Priority Scope" : "Standard GPSR"}
                </span>
              </div>
              <div className="mb-3">
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {result.product_safety.gpsr_applies
                    ? "Mandatory EU Responsible Person (GPSR Art. 16)"
                    : "Standard Safety Framework"}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {result.product_safety.traceability_summary}
                </p>
              </div>
              <div className="space-y-1.5 mb-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Applicable Directives:
                </span>
                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                  {result.product_safety.likely_ce_directives.map((dir, i) => (
                    <li key={i} className="truncate" title={dir}>
                      {dir}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-100/50 dark:bg-emerald-900/30 text-[11px] text-emerald-900 dark:text-emerald-200">
              {result.product_safety.dpp_note}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Checklist (Saved in LocalStorage) */}
      <div data-testid="interactive-checklist-section" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-5 sm:p-7 shadow-lg">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Actionable EU Market Entry Checklist
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Progress is automatically saved to your browser (no account required).
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {Object.values(checkedItems).filter(Boolean).length} of {result.checklist.length} Completed
          </span>
        </div>

        <div className="space-y-3">
          {result.checklist.map((item) => {
            const isChecked = Boolean(checkedItems[item.id]);
            const partner = getPartnerBySlot(item.partner_slot);

            return (
              <div
                key={item.id}
                data-testid={`checklist-item-${item.id}`}
                className={`p-4 rounded-xl border transition-all ${
                  isChecked
                    ? "bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-75"
                    : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-xs"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <input
                    type="checkbox"
                    id={`check-${item.id}`}
                    checked={isChecked}
                    onChange={() => toggleCheck(item.id)}
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <label
                        htmlFor={`check-${item.id}`}
                        className={`text-xs sm:text-sm font-bold cursor-pointer ${
                          isChecked
                            ? "line-through text-slate-400 dark:text-slate-500"
                            : "text-slate-900 dark:text-white"
                        }`}
                      >
                        {item.title}
                      </label>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {item.pillar}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          item.priority === "Immediate"
                            ? "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300"
                            : item.priority === "Short-term"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.detail}
                    </p>

                    {/* Contextual Partner Slot (Config-driven, labeled 'Partner') */}
                    {partner && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
                        <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                          <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-[9px] uppercase tracking-wider">
                            Partner
                          </span>
                          <span>{partner.name} — {partner.tagline}</span>
                        </span>
                        <a
                          href={partner.url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0"
                        >
                          <span>{partner.ctaLabel}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mandatory Statutory Notice */}
      <Disclaimer verifiedDate={result.verified_date} />
    </div>
  );
}
