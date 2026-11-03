import { describe, it, expect } from "vitest";
import { routeProduct } from "@/lib/router";

describe("Router Classification Shape (Step A)", () => {
  it("classifies '100% cotton t-shirt' as physical with no AI", () => {
    const res = routeProduct("100% cotton t-shirt with screen printed logo");
    expect(res.product_type).toBe("physical");
    expect(res.is_physical).toBe(true);
    expect(res.has_ai).toBe(false);
  });

  it("classifies 'AI resume screening SaaS' as digital with AI", () => {
    const res = routeProduct("AI resume screening SaaS cloud platform for recruiter hiring");
    expect(res.product_type).toBe("digital");
    expect(res.is_physical).toBe(false);
    expect(res.has_ai).toBe(true);
  });

  it("classifies 'smart baby monitor with face recognition' as physical_with_ai", () => {
    const res = routeProduct("smart baby monitor hardware with Wi-Fi and facial emotion recognition");
    expect(res.product_type).toBe("physical_with_ai");
    expect(res.is_physical).toBe(true);
    expect(res.has_ai).toBe(true);
  });
});
