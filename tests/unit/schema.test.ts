import { describe, it, expect } from "vitest";
import { euPassLlmResponseZodSchema } from "@/lib/schema";
import { runEuPassScan } from "@/lib/scanner";

describe("LLM Output Schema Validation with Mocked Gemini", () => {
  it("validates physical cotton shirt output schema", async () => {
    const result = await runEuPassScan(
      { description: "100% cotton crewneck t-shirt apparel" },
      { forceMock: true }
    );

    const parsed = euPassLlmResponseZodSchema.safeParse(result);
    expect(parsed.success).toBe(true);
    expect(result.product_type).toBe("physical");
    expect(result.has_ai).toBe(false);
    expect(result.hs).not.toBeNull();
    expect(result.hs?.code).toBe("6109.10");
    expect(result.product_safety).not.toBeNull();
    expect(result.product_safety?.gpsr_applies).toBe(true);
    expect(result.ai_act).toBeNull();
  });

  it("validates digital AI resume screener output schema", async () => {
    const result = await runEuPassScan(
      { description: "AI resume screening SaaS candidate ranking tool" },
      { forceMock: true }
    );

    const parsed = euPassLlmResponseZodSchema.safeParse(result);
    expect(parsed.success).toBe(true);
    expect(result.product_type).toBe("digital");
    expect(result.has_ai).toBe(true);
    expect(result.hs).toBeNull();
    expect(result.product_safety).toBeNull();
    expect(result.ai_act).not.toBeNull();
    expect(result.ai_act?.risk_tier).toBe("High");
    expect(result.ai_act?.matched_article).toContain("Annex III");
  });

  it("validates physical_with_ai smart monitor output schema", async () => {
    const result = await runEuPassScan(
      { description: "smart baby monitor with face recognition camera" },
      { forceMock: true }
    );

    const parsed = euPassLlmResponseZodSchema.safeParse(result);
    expect(parsed.success).toBe(true);
    expect(result.product_type).toBe("physical_with_ai");
    expect(result.has_ai).toBe(true);
    expect(result.hs).not.toBeNull();
    expect(result.ai_act).not.toBeNull();
    expect(result.product_safety).not.toBeNull();
  });
});
