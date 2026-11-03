"use client";

import React, { createContext, useContext, useState, useSyncExternalStore } from "react";

export interface ConsentState {
  hasAnswered: boolean;
  adStorage: boolean;
  adUserData: boolean;
  adPersonalization: boolean;
  analyticsStorage: boolean;
}

const defaultConsent: ConsentState = {
  hasAnswered: false,
  adStorage: false,
  adUserData: false,
  adPersonalization: false,
  analyticsStorage: false,
};

const ConsentContext = createContext<{
  consent: ConsentState;
  acceptAll: () => void;
  rejectAll: () => void;
  updateConsent: (partial: Partial<ConsentState>) => void;
}>({
  consent: defaultConsent,
  acceptAll: () => {},
  rejectAll: () => {},
  updateConsent: () => {},
});

const CONSENT_STORAGE_KEY = "eupass_consent_v2";

function updateGtagConsent(state: ConsentState) {
  if (typeof window !== "undefined" && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
    const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag;
    gtag("consent", "update", {
      ad_storage: state.adStorage ? "granted" : "denied",
      ad_user_data: state.adUserData ? "granted" : "denied",
      ad_personalization: state.adPersonalization ? "granted" : "denied",
      analytics_storage: state.analyticsStorage ? "granted" : "denied",
    });
  }
}

function getStoredConsent(): ConsentState {
  if (typeof window === "undefined") return defaultConsent;
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as ConsentState;
    }
  } catch {
    // ignore
  }
  return defaultConsent;
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  // Use a client-mounted store or lazy state initialization
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const [consent, setConsent] = useState<ConsentState>(() => getStoredConsent());

  const saveConsent = (updated: ConsentState) => {
    setConsent(updated);
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    updateGtagConsent(updated);
  };

  const acceptAll = () => {
    saveConsent({
      hasAnswered: true,
      adStorage: true,
      adUserData: true,
      adPersonalization: true,
      analyticsStorage: true,
    });
  };

  const rejectAll = () => {
    saveConsent({
      hasAnswered: true,
      adStorage: false,
      adUserData: false,
      adPersonalization: false,
      analyticsStorage: false,
    });
  };

  const updateConsent = (partial: Partial<ConsentState>) => {
    saveConsent({
      ...consent,
      ...partial,
      hasAnswered: true,
    });
  };

  // On SSR or initial hydration fallback to default to avoid mismatch
  const activeConsent = isClient ? consent : defaultConsent;

  return (
    <ConsentContext.Provider value={{ consent: activeConsent, acceptAll, rejectAll, updateConsent }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  return useContext(ConsentContext);
}
