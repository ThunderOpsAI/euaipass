import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { AdSlot } from "@/components/ad-slot";
import { ConsentProvider } from "@/lib/consent";

describe("AdSlot Component", () => {
  it("renders strictly null when NEXT_PUBLIC_ADSENSE_CLIENT is unset", () => {
    const prev = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
    delete process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

    const html = renderToString(
      <ConsentProvider>
        <AdSlot slot="test-slot-123" />
      </ConsentProvider>
    );

    expect(html).toBe("");

    process.env.NEXT_PUBLIC_ADSENSE_CLIENT = prev;
  });

  it("renders reserved height container when NEXT_PUBLIC_ADSENSE_CLIENT is set", () => {
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT = "ca-pub-1234567890123456";

    const html = renderToString(
      <ConsentProvider>
        <AdSlot slot="test-slot-123" />
      </ConsentProvider>
    );

    expect(html).toContain('data-testid="ad-slot-container"');
    expect(html).toContain("min-h-");

    delete process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  });
});
