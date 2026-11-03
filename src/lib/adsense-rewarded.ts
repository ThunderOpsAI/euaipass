/**
 * Google AdSense & Web Rewarded Ad Helper
 *
 * Implements the lifecycle for Google Web Rewarded Ads (AdSense / GPT)
 * allowing users to watch an ad to earn their report download.
 */

export interface RewardedAdOptions {
  onRewardGranted: () => void;
  onDismissed?: () => void;
  onError?: (error: Error) => void;
}

export interface AdBreakPlacementInfo {
  breakStatus?: "notReady" | "error" | "timeout" | "viewed" | "dismissed";
}

export interface AdBreakOptions {
  type: string;
  name: string;
  beforeReward: (showAdFn: () => void) => void;
  adDismissed: () => void;
  adViewed: () => void;
  adBreakDone: (placementInfo: AdBreakPlacementInfo) => void;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
    adBreak?: (options: AdBreakOptions) => void;
  }
}

/**
 * Checks whether AdSense client is configured and available in the browser.
 */
export function isAdSenseConfigured(): boolean {
  if (typeof window === "undefined") return false;
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  return Boolean(client && client.trim() !== "");
}

/**
 * Request a Web Rewarded Ad break.
 * If AdSense is not configured, or if the ad fails to fill/load,
 * it safely falls back to granting the reward so users are not blocked.
 */
export async function triggerRewardedAd(options: RewardedAdOptions): Promise<void> {
  const { onRewardGranted, onDismissed, onError } = options;

  if (typeof window === "undefined") {
    onRewardGranted();
    return;
  }

  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  // 1. If no AdSense client is set (e.g. dev or testing), immediately grant reward
  if (!client || client.trim() === "") {
    onRewardGranted();
    return;
  }

  try {
    // 2. Check for Google AdSense adBreak API (Web Rewarded)
    if (typeof window.adBreak === "function") {
      window.adBreak({
        type: "reward",
        name: "eupass_pdf_unlock",
        beforeReward: (showAdFn: () => void) => {
          showAdFn();
        },
        adDismissed: () => {
          if (onDismissed) onDismissed();
        },
        adViewed: () => {
          onRewardGranted();
        },
        adBreakDone: (placementInfo: AdBreakPlacementInfo) => {
          if (placementInfo?.breakStatus === "notReady" || placementInfo?.breakStatus === "error") {
            // Graceful fallback if ad network didn't fill
            onRewardGranted();
          }
        },
      });
      return;
    }

    // 3. Fallback: if script is not yet injected or adblocker blocked adBreak,
    // ensure the user still receives their statutory document.
    onRewardGranted();
  } catch (err: unknown) {
    if (onError && err instanceof Error) {
      onError(err);
    } else if (onError) {
      onError(new Error(String(err)));
    }
    // Graceful degradation: never lock user out of compliance report
    onRewardGranted();
  }
}
