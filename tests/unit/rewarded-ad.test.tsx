import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { RewardedAdModal } from "@/components/rewarded-ad-modal";
import { triggerRewardedAd, isAdSenseConfigured } from "@/lib/adsense-rewarded";

describe("Rewarded Ad Functionality", () => {
  it("renders null when modal is closed (isOpen = false)", () => {
    const html = renderToString(
      <RewardedAdModal isOpen={false} onClose={() => {}} onRewardUnlocked={() => {}} />
    );
    expect(html).toBe("");
  });

  it("renders modal with CTA when open", () => {
    const html = renderToString(
      <RewardedAdModal isOpen={true} onClose={() => {}} onRewardUnlocked={() => {}} />
    );
    expect(html).toContain('data-testid="rewarded-ad-modal"');
    expect(html).toContain('data-testid="start-rewarded-ad-btn"');
    expect(html).toContain("Official EU Compliance Dossier");
    expect(html).toContain("Watch Sponsor Message &amp; Unlock PDF");
  });

  it("triggers onRewardGranted immediately in non-browser or unconfigured environments", async () => {
    const onRewardGranted = vi.fn();
    const prev = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
    delete process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

    await triggerRewardedAd({ onRewardGranted });
    expect(onRewardGranted).toHaveBeenCalledTimes(1);

    process.env.NEXT_PUBLIC_ADSENSE_CLIENT = prev;
  });

  it("isAdSenseConfigured correctly detects presence of client ID", () => {
    const prev = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
    
    delete process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
    expect(isAdSenseConfigured()).toBe(false);

    process.env.NEXT_PUBLIC_ADSENSE_CLIENT = "ca-pub-123456789";
    expect(isAdSenseConfigured()).toBe(true);

    process.env.NEXT_PUBLIC_ADSENSE_CLIENT = prev;
  });
});
