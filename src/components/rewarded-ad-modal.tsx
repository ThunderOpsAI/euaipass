"use client";

import React, { useState } from "react";
import { triggerRewardedAd, isAdSenseConfigured } from "@/lib/adsense-rewarded";
import {
  FileText,
  PlayCircle,
  X,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Loader2,
} from "lucide-react";

interface RewardedAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardUnlocked: () => void;
}

export function RewardedAdModal({
  isOpen,
  onClose,
  onRewardUnlocked,
}: RewardedAdModalProps) {
  const [adState, setAdState] = useState<"ready" | "playing" | "completed">("ready");
  const [countdown, setCountdown] = useState(10);
  const adsConfigured = isAdSenseConfigured();

  if (!isOpen) return null;

  const handleClose = () => {
    setAdState("ready");
    setCountdown(10);
    onClose();
  };

  const handleStartAd = () => {
    setAdState("playing");
    setCountdown(10);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setAdState("completed");
          setTimeout(() => {
            onRewardUnlocked();
            handleClose();
          }, 800);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    void triggerRewardedAd({
      onRewardGranted: () => {
        clearInterval(timer);
        setAdState("completed");
        setTimeout(() => {
          onRewardUnlocked();
          handleClose();
        }, 800);
      },
      onDismissed: () => {
        clearInterval(timer);
        setAdState("ready");
      },
      onError: () => {
        clearInterval(timer);
        setAdState("completed");
        setTimeout(() => {
          onRewardUnlocked();
          handleClose();
        }, 800);
      },
    });
  };

  return (
    <div
      data-testid="rewarded-ad-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rewarded-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={handleClose}
          data-testid="close-rewarded-modal-btn"
          disabled={adState === "playing" && countdown > 3}
          aria-label="Close modal"
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <X className="w-5 h-5" />
        </button>

        {adState === "ready" && (
          <div className="space-y-5 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
              <FileText className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <Sparkles className="w-3.5 h-3.5" /> 100% Free Service
              </span>
              <h2
                id="rewarded-modal-title"
                className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white"
              >
                Official EU Compliance Dossier
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                EUPass is a free public utility. Watch a brief 10-second sponsor message to unlock and generate your audit-ready PDF export.
              </p>
            </div>

            {/* Benefit Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-left space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Included in Your PDF Report:
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400 pl-1">
                <li>WCO 6-digit Harmonized System tariff code snippet</li>
                <li>EU AI Act risk tier & Article/Annex statutory citations</li>
                <li>GPSR & CE Directives mandatory checklist</li>
              </ul>
            </div>

            <button
              onClick={handleStartAd}
              data-testid="start-rewarded-ad-btn"
              className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlayCircle className="w-5 h-5" />
              Watch Sponsor Message & Unlock PDF
            </button>

            <p className="text-[11px] text-slate-400">
              {adsConfigured
                ? "Contextual ads served via Google AdSense under EU Consent Mode v2."
                : "Development mode active: instant reward enabled."}
            </p>
          </div>
        )}

        {adState === "playing" && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 dark:bg-blue-950/50 border-2 border-blue-500 flex items-center justify-center text-blue-600 text-xl font-black animate-pulse">
              {countdown}s
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Sponsor Message in Progress
              </div>
              <h3 className="text-base font-bold text-slate-950 dark:text-white">
                Unlocking Your EU Compliance Dossier
              </h3>
              <p className="text-xs text-slate-500">
                Please wait a few seconds. Your PDF download will begin automatically when completed.
              </p>
            </div>

            {/* Simulated progress bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${((10 - countdown) / 10) * 100}%` }}
              />
            </div>
          </div>
        )}

        {adState === "completed" && (
          <div className="space-y-4 text-center py-6 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-950 dark:text-white">
                Reward Unlocked!
              </h3>
              <p className="text-xs text-slate-500">
                Generating and downloading your official compliance dossier now...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
