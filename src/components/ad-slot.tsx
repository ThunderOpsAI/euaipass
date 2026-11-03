"use client";

import React, { useEffect } from "react";
import { useConsent } from "@/lib/consent";

export interface AdSlotProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
  responsive?: boolean;
}

export function AdSlot({
  slot,
  format = "auto",
  className = "",
  responsive = true,
}: AdSlotProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const { consent } = useConsent();

  // Gated by Consent Mode v2 (ads only load if adStorage consent is granted)
  const isConsentGranted = consent.hasAnswered && consent.adStorage;
  const isClientSet = Boolean(client && client.trim() !== "");

  useEffect(() => {
    if (isClientSet && isConsentGranted && typeof window !== "undefined") {
      try {
        const adsbygoogle = (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || [];
        adsbygoogle.push({});
        (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle = adsbygoogle;
      } catch {
        // ignore duplicate load attempts
      }
    }
  }, [isClientSet, isConsentGranted, slot]);

  // If env var is unset or empty, strictly render null (prevents CLS & empty boxes)
  if (!isClientSet) {
    return null;
  }

  // Minimum reserved height prevents Cumulative Layout Shift (CLS < 0.1 requirement)
  return (
    <div
      data-testid="ad-slot-container"
      className={`my-6 mx-auto w-full max-w-4xl min-h-[100px] sm:min-h-[120px] md:min-h-[250px] bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 rounded-xl flex items-center justify-center p-2 text-center overflow-hidden transition-all ${className}`}
    >
      {!isConsentGranted ? (
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
          Advertisement [Awaiting Consent]
        </span>
      ) : (
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", height: "100%" }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      )}
    </div>
  );
}
