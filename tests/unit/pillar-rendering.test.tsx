import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { ResultView } from "@/components/result-view";
import type { EuPassScanResult } from "@/lib/schema";

const baseResult: EuPassScanResult = {
  scan_id: "scan_test_123",
  verified_date: "2026-10-01",
  created_at: new Date().toISOString(),
  product_type: "physical",
  has_ai: false,
  product_summary: "Physical cotton t-shirt",
  commercial_invoice_snippet: "HS 6109.10 T-shirt",
  hs: {
    code: "6109.10",
    description: "T-shirts of cotton",
    confidence_tier: "high",
    confidence_score: 0.94,
    review_recommended: false,
    rationale: "Constituent cotton material",
    alternatives: [],
  },
  ai_act: null,
  product_safety: {
    gpsr_applies: true,
    eu_responsible_person_required: true,
    traceability_summary: "GPSR batch labeling required",
    likely_ce_directives: ["GPSR"],
    dpp_espr_flag: true,
    dpp_note: "Textiles DPP priority",
  },
  checklist: [
    {
      id: "chk-1",
      pillar: "customs",
      title: "Declare HS 6109.10",
      detail: "Print on commercial invoice",
      priority: "Immediate",
    },
  ],
};

describe("Conditional Pillar Rendering", () => {
  it("renders Customs and Safety, but not AI Act for physical cotton shirt", () => {
    const html = renderToString(<ResultView result={baseResult} />);
    expect(html).toContain('data-testid="pillar-customs-card"');
    expect(html).toContain('data-testid="pillar-product-safety-card"');
    expect(html).not.toContain('data-testid="pillar-ai-act-card"');
  });

  it("renders AI Act, but not Customs or Safety for digital SaaS", () => {
    const digitalResult: EuPassScanResult = {
      ...baseResult,
      product_type: "digital",
      has_ai: true,
      hs: null,
      product_safety: null,
      ai_act: {
        risk_tier: "High",
        matched_article: "Annex III Point 4(a)",
        matched_category: "Employment & Workers Management",
        annex_scope: "Annex III",
        confidence: "High",
        rationale: "HR resume screener",
      },
    };

    const html = renderToString(<ResultView result={digitalResult} />);
    expect(html).toContain('data-testid="pillar-ai-act-card"');
    expect(html).not.toContain('data-testid="pillar-customs-card"');
    expect(html).not.toContain('data-testid="pillar-product-safety-card"');
  });
});
