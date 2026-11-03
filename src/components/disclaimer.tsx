import React from "react";
import { AlertTriangle, ShieldCheck } from "lucide-react";

export function Disclaimer({
  verifiedDate = "2026-10-01",
  compact = false,
}: {
  verifiedDate?: string;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div
        data-testid="statutory-disclaimer-compact"
        className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 bg-slate-50/80 dark:bg-slate-900/60 leading-normal"
      >
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
        <span>
          <strong className="font-semibold text-slate-800 dark:text-slate-200">Statutory Notice:</strong> Automated regulatory readiness aid for informational purposes. Not legal counsel, customs brokerage, or official CE certification. Last verified: {verifiedDate}.
        </span>
      </div>
    );
  }

  return (
    <div
      data-testid="statutory-disclaimer"
      className="rounded-xl border border-amber-300/70 bg-amber-50/60 dark:bg-amber-950/20 dark:border-amber-900/50 p-4 sm:p-5 shadow-xs transition-colors my-6"
    >
      <div className="flex items-start gap-3.5">
        <div className="rounded-lg bg-amber-100 dark:bg-amber-900/60 p-2 text-amber-800 dark:text-amber-300 shrink-0 mt-0.5">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="space-y-1.5 text-xs sm:text-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-amber-950 dark:text-amber-200">
              Mandatory Legal & Customs Notice
            </h4>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-200/80 dark:bg-amber-900/70 text-amber-900 dark:text-amber-300">
              Not Legal/Customs Advice
            </span>
            <span className="text-xs text-amber-800/80 dark:text-amber-400/80 ml-auto font-mono">
              Last Verified: {verifiedDate}
            </span>
          </div>
          <p className="text-amber-900/90 dark:text-amber-300/90 leading-relaxed font-normal">
            EUPass provides automated risk screening and customs tariff suggestions based on Regulation (EU) 2024/1689 (EU AI Act), Regulation (EU) 2023/988 (GPSR), and the Union Customs Code. It does <strong>not constitute binding legal counsel, Binding Tariff Information (BTI), or notified body conformity certification</strong>. Organizations and distance sellers must perform formal conformity assessments and customs declarations with qualified specialists.
          </p>
          <div className="pt-1 flex items-center gap-2 text-xs font-medium text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Privacy Guarantee: Product descriptions and uploaded images are processed strictly in volatile RAM and are never persisted or logged.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
