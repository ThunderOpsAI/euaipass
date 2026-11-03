import { z } from "zod";
import { Type, type Schema } from "@google/genai";

export const hsAlternativeZodSchema = z.object({
  code: z.string(),
  description: z.string(),
  confidence_score: z.number(),
  rationale: z.string().optional(),
});

export const hsPillarZodSchema = z.object({
  code: z.string(),
  description: z.string(),
  confidence_tier: z.enum(["high", "medium", "low"]),
  confidence_score: z.number(),
  review_recommended: z.boolean(),
  rationale: z.string(),
  alternatives: z.array(hsAlternativeZodSchema),
});

export const aiActPillarZodSchema = z.object({
  risk_tier: z.enum(["Unacceptable", "High", "Limited", "Minimal"]),
  matched_article: z.string(),
  matched_category: z.string(),
  annex_scope: z.enum(["Annex I", "Annex III", "Article 5", "Article 50", "Minimal"]),
  confidence: z.enum(["High", "Medium", "Low"]),
  rationale: z.string(),
});

export const productSafetyPillarZodSchema = z.object({
  gpsr_applies: z.boolean(),
  eu_responsible_person_required: z.boolean(),
  traceability_summary: z.string(),
  likely_ce_directives: z.array(z.string()),
  dpp_espr_flag: z.boolean(),
  dpp_note: z.string(),
});

export const checklistItemZodSchema = z.object({
  id: z.string(),
  pillar: z.enum(["customs", "ai_act", "product_safety"]),
  title: z.string(),
  detail: z.string(),
  priority: z.enum(["Immediate", "Short-term", "Medium-term"]),
  partner_slot: z.string().nullable().optional(),
});

export const euPassLlmResponseZodSchema = z.object({
  product_type: z.enum(["physical", "digital", "physical_with_ai"]),
  has_ai: z.boolean(),
  product_summary: z.string(),
  hs: hsPillarZodSchema.nullable(),
  ai_act: aiActPillarZodSchema.nullable(),
  product_safety: productSafetyPillarZodSchema.nullable(),
  checklist: z.array(checklistItemZodSchema).min(1),
});

export type HsAlternative = z.infer<typeof hsAlternativeZodSchema>;
export type HsPillarResult = z.infer<typeof hsPillarZodSchema>;
export type AiActPillarResult = z.infer<typeof aiActPillarZodSchema>;
export type ProductSafetyPillarResult = z.infer<typeof productSafetyPillarZodSchema>;
export type ChecklistItem = z.infer<typeof checklistItemZodSchema>;
export type EuPassLlmResponse = z.infer<typeof euPassLlmResponseZodSchema>;

export interface EuPassScanResult extends EuPassLlmResponse {
  scan_id: string;
  verified_date: string;
  created_at: string;
  commercial_invoice_snippet: string | null;
}

/**
 * @google/genai strict JSON responseSchema for the single unified Gemini pass.
 */
export const euPassGenAiSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    product_type: {
      type: Type.STRING,
      enum: ["physical", "digital", "physical_with_ai"],
      description: "Whether the product is a physical good, digital software/SaaS, or a physical product with embedded/connected AI.",
    },
    has_ai: {
      type: Type.BOOLEAN,
      description: "True if the product includes artificial intelligence, machine learning, biometric recognition, or algorithmic decision-making.",
    },
    product_summary: {
      type: Type.STRING,
      description: "Neutral 1-sentence functional summary of the product without quoting raw user input verbatim.",
    },
    hs: {
      type: Type.OBJECT,
      nullable: true,
      description: "6-digit WCO Harmonized System customs classification. Set to null if product_type is digital.",
      properties: {
        code: { type: Type.STRING, description: "6-digit HS code in XXXX.XX format." },
        description: { type: Type.STRING, description: "Standard WCO-style customs tariff description." },
        confidence_tier: { type: Type.STRING, enum: ["high", "medium", "low"] },
        confidence_score: { type: Type.NUMBER },
        review_recommended: { type: Type.BOOLEAN },
        rationale: { type: Type.STRING },
        alternatives: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              code: { type: Type.STRING },
              description: { type: Type.STRING },
              confidence_score: { type: Type.NUMBER },
              rationale: { type: Type.STRING },
            },
            required: ["code", "description", "confidence_score"],
          },
        },
      },
      required: [
        "code",
        "description",
        "confidence_tier",
        "confidence_score",
        "review_recommended",
        "rationale",
        "alternatives",
      ],
    },
    ai_act: {
      type: Type.OBJECT,
      nullable: true,
      description: "EU AI Act Regulation (EU) 2024/1689 assessment. Set to null if has_ai is false.",
      properties: {
        risk_tier: {
          type: Type.STRING,
          enum: ["Unacceptable", "High", "Limited", "Minimal"],
        },
        matched_article: {
          type: Type.STRING,
          description: "Exact statutory reference (e.g. Annex III Point 4(a), Annex I & Annex III Point 1(a), Article 5(1)(c), Article 50(1)).",
        },
        matched_category: {
          type: Type.STRING,
          description: "Matched regulatory domain or category title.",
        },
        annex_scope: {
          type: Type.STRING,
          enum: ["Annex I", "Annex III", "Article 5", "Article 50", "Minimal"],
          description: "Annex I for AI embedded in CE-marked physical products; Annex III for standalone high-risk AI.",
        },
        confidence: {
          type: Type.STRING,
          enum: ["High", "Medium", "Low"],
        },
        rationale: {
          type: Type.STRING,
          description: "2-3 sentence regulatory rationale explaining the classification without quoting verbatim from user input.",
        },
      },
      required: [
        "risk_tier",
        "matched_article",
        "matched_category",
        "annex_scope",
        "confidence",
        "rationale",
      ],
    },
    product_safety: {
      type: Type.OBJECT,
      nullable: true,
      description: "EU General Product Safety Regulation (GPSR), CE Marking & Digital Product Passport (DPP/ESPR) assessment. Set to null if product_type is digital.",
      properties: {
        gpsr_applies: { type: Type.BOOLEAN },
        eu_responsible_person_required: { type: Type.BOOLEAN },
        traceability_summary: { type: Type.STRING },
        likely_ce_directives: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        dpp_espr_flag: { type: Type.BOOLEAN },
        dpp_note: { type: Type.STRING },
      },
      required: [
        "gpsr_applies",
        "eu_responsible_person_required",
        "traceability_summary",
        "likely_ce_directives",
        "dpp_espr_flag",
        "dpp_note",
      ],
    },
    checklist: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          pillar: { type: Type.STRING, enum: ["customs", "ai_act", "product_safety"] },
          title: { type: Type.STRING },
          detail: { type: Type.STRING },
          priority: { type: Type.STRING, enum: ["Immediate", "Short-term", "Medium-term"] },
          partner_slot: {
            type: Type.STRING,
            nullable: true,
            description: "Optional partner slot key: customs_broker_ioss | eu_responsible_person | ce_testing_lab | dpp_traceability | ai_act_conformity",
          },
        },
        required: ["id", "pillar", "title", "detail", "priority"],
      },
    },
  },
  required: [
    "product_type",
    "has_ai",
    "product_summary",
    "hs",
    "ai_act",
    "product_safety",
    "checklist",
  ],
};
