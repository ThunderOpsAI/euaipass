import { GoogleGenAI } from "@google/genai";
import {
  routeProduct,
  validateScanInput,
  type ScanInput,
  type RouterResult,
} from "./router";
import {
  retrieveHsCandidates,
  type HsRetrievalResult,
} from "./hs-rag";
import {
  euPassGenAiSchema,
  euPassLlmResponseZodSchema,
  type EuPassLlmResponse,
  type EuPassScanResult,
  type ChecklistItem,
} from "./schema";
import { getHsChapter } from "@/data/hs-taxonomy";

export function getVerifiedDate(): string {
  return (
    process.env.VERIFIED_DATE ||
    process.env.NEXT_PUBLIC_VERIFIED_DATE ||
    "2026-10-01"
  );
}

export function buildCommercialInvoiceSnippet(
  code: string,
  description: string
): string {
  return [
    `HS SUBHEADING (WCO 6-DIGIT): ${code}`,
    `COMMERCIAL INVOICE DESCRIPTION: ${description}`,
    `EU ICS2 / IOSS VAT THRESHOLD NOTE: For consignments with an intrinsic value <= EUR 150, declare your 12-character EU IOSS VAT ID on the electronic customs manifest (EAD/ENS) for 0% customs duty relief and simplified import VAT clearance. Consignments exceeding EUR 150 require standard formal customs entry (SAD/CDS) and applicable TARIC duty/import VAT assessment.`,
  ].join("\n");
}

function buildDeterministicResponse(
  description: string,
  routerResult: RouterResult,
  hsRetrieval: HsRetrievalResult | null
): EuPassLlmResponse {
  const lower = description.toLowerCase();
  const isPhysical = routerResult.is_physical;
  const hasAi = routerResult.has_ai;

  let hs: EuPassLlmResponse["hs"] = null;
  let product_safety: EuPassLlmResponse["product_safety"] = null;
  let ai_act: EuPassLlmResponse["ai_act"] = null;
  const checklist: ChecklistItem[] = [];

  if (isPhysical && hsRetrieval) {
    const primary = hsRetrieval.candidates[0] || {
      hs_code: "8479.89",
      description: "Machines and mechanical appliances having individual functions",
      score: 0.72,
    };
    const alternatives = hsRetrieval.candidates.slice(1, 3).map((alt) => ({
      code: alt.hs_code,
      description: alt.description,
      confidence_score: alt.score,
      rationale: `Alternative 6-digit subheading candidate within Chapter ${alt.hs_code.slice(0, 2)}.`,
    }));

    hs = {
      code: primary.hs_code,
      description: primary.description,
      confidence_tier: hsRetrieval.tier,
      confidence_score: primary.score,
      review_recommended: hsRetrieval.review_recommended,
      rationale: `Classified under WCO Subheading ${primary.hs_code} based on constituent material and primary commercial function under General Rules for the Interpretation of the Harmonized System (GRI 1).`,
      alternatives,
    };

    const chInfo = getHsChapter(primary.hs_code.slice(0, 2));
    const isElectronicOrSmart =
      routerResult.product_type === "physical_with_ai" ||
      ["84", "85", "88", "90", "95"].includes(primary.hs_code.slice(0, 2));

    const ceDirectives = isElectronicOrSmart
      ? [
          "Radio Equipment Directive (RED) 2014/53/EU (incl. Art. 3(3) Cybersecurity)",
          "Low Voltage Directive (LVD) 2014/35/EU & EMC Directive 2014/30/EU",
          "RoHS Directive 2011/65/EU (Restriction of Hazardous Substances)",
          ...(routerResult.product_type === "physical_with_ai"
            ? ["Cyber Resilience Act (EU) 2024/2847 (Connected Hardware with Digital Elements)"]
            : []),
        ]
      : chInfo?.likelyDirectives || [
          "General Product Safety Regulation (EU) 2023/988 (GPSR)",
          "EU Textile Fiber Labeling Regulation (EU) 1007/2011",
        ];

    const dppFlag = chInfo ? chInfo.dppRelevant : true;

    product_safety = {
      gpsr_applies: true,
      eu_responsible_person_required: true,
      traceability_summary:
        "Under GPSR Regulation (EU) 2023/988 (Articles 9, 16 & 19), physical consumer products sold into the EU require an appointed EU27 Responsible Person, physical batch/serial traceability marking, and localized safety disclosures on online product listings.",
      likely_ce_directives: ceDirectives,
      dpp_espr_flag: dppFlag,
      dpp_note: dppFlag
        ? `HS Chapter ${primary.hs_code.slice(0, 2)} falls within the Ecodesign for Sustainable Products Regulation (ESPR) (EU) 2024/1781 priority scope for QR-linked Digital Product Passports (DPP).`
        : "Standard GPSR technical file applies; monitor future ESPR delegated acts.",
    };

    checklist.push(
      {
        id: "chk-customs-1",
        pillar: "customs",
        title: `Declare WCO 6-Digit HS Code ${primary.hs_code} on Commercial Invoice & ICS2 ENS`,
        detail: `Use ${primary.hs_code} (${primary.description}) on all carrier commercial invoices and Import Control System 2 (ICS2) electronic declarations. Verify whether shipment intrinsic value is <= EUR 150 for IOSS fast-track clearance.`,
        priority: "Immediate",
        partner_slot: "customs_broker_ioss",
      },
      {
        id: "chk-safety-1",
        pillar: "product_safety",
        title: "Appoint an EU Responsible Person & Update Packaging Traceability (GPSR Art. 16 & 19)",
        detail:
          "Designate an EU27-established Responsible Person, print their postal and electronic address alongside batch/serial identifiers on the product or packaging, and display them on your e-commerce checkout pages.",
        priority: "Immediate",
        partner_slot: "eu_responsible_person",
      }
    );

    if (isElectronicOrSmart) {
      checklist.push({
        id: "chk-safety-2",
        pillar: "product_safety",
        title: "Compile CE Technical Documentation & Sign Single EU Declaration of Conformity",
        detail: `Verify EN harmonized test reports for ${ceDirectives.slice(0, 2).join(" and ")} and affix the CE mark (minimum 5mm) prior to EU shipment.`,
        priority: "Short-term",
        partner_slot: "ce_testing_lab",
      });
    }

    if (dppFlag) {
      checklist.push({
        id: "chk-safety-3",
        pillar: "product_safety",
        title: "Prepare ESPR Digital Product Passport (DPP) Material & Supply-Chain Data",
        detail:
          "Structure bill-of-materials (BoM), REACH SVHC disclosures, and care/recyclability metadata for QR Digital Product Passport readiness under Regulation (EU) 2024/1781.",
        priority: "Medium-term",
        partner_slot: "dpp_traceability",
      });
    }
  }

  if (hasAi) {
    if (
      /social\s*scoring|subliminal|untargeted\s*scraping|emotion\s*recognition\s*in\s*(workplace|school)/i.test(
        lower
      )
    ) {
      ai_act = {
        risk_tier: "Unacceptable",
        matched_article: "Article 5(1)",
        matched_category: "Prohibited AI Practice (Unacceptable Risk)",
        annex_scope: "Article 5",
        confidence: "High",
        rationale:
          "The described AI system triggers a prohibited practice under Chapter II (Article 5) of Regulation (EU) 2024/1689, which is banned from placement on the EU market since 2 February 2025.",
      };
    } else if (/resume|cv|recruitment|hiring|candidate|applicant|employment|worker/i.test(lower)) {
      ai_act = {
        risk_tier: "High",
        matched_article: "Annex III Point 4(a)",
        matched_category: "Employment & Workers Management: Recruitment & Candidate Screening",
        annex_scope: "Annex III",
        confidence: "High",
        rationale:
          "Automated candidate screening, CV/resume parsing, and applicant evaluation software is explicitly classified as a standalone High-Risk AI system under Article 6(2) and Annex III Point 4(a) of the EU AI Act.",
      };
    } else if (
      routerResult.product_type === "physical_with_ai" &&
      /baby\s*monitor|face\s*recognition|facial\s*recognition|biometric|camera|toy|medical|robot|drone/i.test(
        lower
      )
    ) {
      ai_act = {
        risk_tier: "High",
        matched_article: "Article 6(1) Annex I & Annex III Point 1(a)",
        matched_category:
          "AI Embedded in CE-Regulated Hardware (Annex I) & Biometric Identification (Annex III)",
        annex_scope: "Annex I",
        confidence: "High",
        rationale:
          "Connected hardware incorporating facial/biometric recognition and child/safety monitoring triggers High-Risk classification under both Annex I (AI safety/regulated components in CE-marked radio/consumer equipment) and Annex III Point 1 (Biometric identification & categorization).",
      };
    } else if (/credit\s*scor|loan|insurance|emergency\s*dispatch|admission|proctoring|biometric/i.test(lower)) {
      ai_act = {
        risk_tier: "High",
        matched_article: "Article 6(2) & Annex III",
        matched_category: "High-Risk Standalone AI System (Annex III)",
        annex_scope: "Annex III",
        confidence: "High",
        rationale:
          "The described AI system operates in a regulated Annex III High-Risk domain affecting fundamental rights, safety, or access to essential services.",
      };
    } else if (/chatbot|assistant|deepfake|synthetic|generative/i.test(lower)) {
      ai_act = {
        risk_tier: "Limited",
        matched_article: "Article 50(1)–(2)",
        matched_category: "Transparency Obligations for Certain AI Systems",
        annex_scope: "Article 50",
        confidence: "High",
        rationale:
          "Interactive conversational AI and synthetic content generation tools fall under Article 50 Limited Risk transparency obligations, requiring clear user disclosure and machine-readable watermarking of synthetic outputs.",
      };
    } else {
      ai_act = {
        risk_tier: routerResult.product_type === "physical_with_ai" ? "High" : "Minimal",
        matched_article:
          routerResult.product_type === "physical_with_ai"
            ? "Article 6(1) & Annex I"
            : "Article 69 (Voluntary Codes of Conduct)",
        matched_category:
          routerResult.product_type === "physical_with_ai"
            ? "AI Component in Regulated Physical Product (Annex I)"
            : "Minimal Risk AI System",
        annex_scope: routerResult.product_type === "physical_with_ai" ? "Annex I" : "Minimal",
        confidence: "Medium",
        rationale:
          routerResult.product_type === "physical_with_ai"
            ? "AI functionality embedded within regulated physical hardware requires evaluation under EU AI Act Article 6(1) and Annex I alongside CE conformity."
            : "The system does not trigger Article 5 prohibitions or Annex III high-risk categories; Article 4 AI literacy and general GDPR data protection rules apply.",
      };
    }

    checklist.push(
      {
        id: "chk-ai-1",
        pillar: "ai_act",
        title: `Complete EU AI Act ${ai_act.risk_tier} Risk Governance (${ai_act.matched_article})`,
        detail:
          ai_act.risk_tier === "High"
            ? "Establish an Article 9 Risk Management System, Article 10 Data Governance & bias testing protocol, Article 11 (Annex IV) Technical Documentation, and Article 14 Human Oversight instructions."
            : ai_act.risk_tier === "Unacceptable"
            ? "Immediately halt EU market placement of prohibited Article 5 capabilities and redesign system architecture."
            : "Implement Article 4 AI Literacy documentation and Article 50 user transparency notices where applicable.",
        priority: "Immediate",
        partner_slot: "ai_act_conformity",
      },
      {
        id: "chk-ai-2",
        pillar: "ai_act",
        title:
          ai_act.annex_scope === "Annex I"
            ? "Integrate AI Act Compliance into Single CE Declaration of Conformity (Art. 43(3))"
            : "Register System in the EU High-Risk AI Database & Configure Event Logging (Art. 12 & 49)",
        detail:
          ai_act.annex_scope === "Annex I"
            ? "Coordinate your EU AI Act Annex IV technical dossier with your CE Notified Body / RED cybersecurity assessment."
            : "Configure automated Article 12 lifecycle logging and register provider/system metadata in the European Commission database prior to EU deployment.",
        priority: "Short-term",
        partner_slot: null,
      }
    );
  }

  const product_summary =
    routerResult.product_type === "physical"
      ? "Physical commercial good assessed for EU customs tariff classification and General Product Safety Regulation (GPSR) entry."
      : routerResult.product_type === "digital"
      ? "Standalone software/AI system assessed against Regulation (EU) 2024/1689 (EU AI Act) risk tiers and statutory obligations."
      : "Connected physical hardware incorporating AI capabilities assessed across EU Customs (HS), EU AI Act (Annex I/III), and Product Safety (GPSR/CE/DPP).";

  return {
    product_type: routerResult.product_type,
    has_ai: routerResult.has_ai,
    product_summary,
    hs,
    ai_act,
    product_safety,
    checklist,
  };
}

export interface RunEuPassScanOptions {
  customLlmCall?: (prompt: string) => Promise<unknown>;
  forceMock?: boolean;
}

/**
 * Runs the complete EUPass 3-step pipeline:
 * - Step A: Router classifies `physical | digital | physical_with_ai` and `has_ai: boolean`
 * - Step B: If physical, runs 6-digit HS RAG retrieval for top-K candidate grounding
 * - Step C: Makes ONE Gemini structured-JSON call (`@google/genai`, `GEMINI_MODEL`, `responseSchema`)
 *
 * PRIVACY: Raw user input (`description` and `image`) is processed strictly in volatile memory
 * and is never logged or persisted to disk/database.
 */
export async function runEuPassScan(
  input: ScanInput,
  options?: RunEuPassScanOptions
): Promise<EuPassScanResult> {
  // Pre-pipeline validation (10-1,000 chars, optional JPEG/PNG/WebP <= 5MB)
  validateScanInput(input);

  const hasImage = Boolean(input.image && input.image.buffer);

  // Step A: Router
  const routerResult = routeProduct(input.description, hasImage);

  // Step B: If physical, run HS RAG retrieval
  let hsRetrieval: HsRetrievalResult | null = null;
  if (routerResult.is_physical) {
    hsRetrieval = await retrieveHsCandidates(input.description, {
      forceLocal: options?.forceMock,
    });
  }

  const verifiedDate = getVerifiedDate();
  const isMock =
    options?.forceMock ||
    process.env.MOCK_GEMINI === "true" ||
    !process.env.GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY.trim() === "";

  let llmResult: EuPassLlmResponse;

  if (options?.customLlmCall) {
    const raw = await options.customLlmCall(input.description);
    llmResult = euPassLlmResponseZodSchema.parse(raw);
  } else if (isMock) {
    const built = buildDeterministicResponse(input.description, routerResult, hsRetrieval);
    llmResult = euPassLlmResponseZodSchema.parse(built);
  } else {
    // Step C: ONE Gemini API call using @google/genai, GEMINI_MODEL env var, and responseSchema
    const apiKey = process.env.GEMINI_API_KEY!;
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const ai = new GoogleGenAI({ apiKey });

    const candidateGrounding =
      hsRetrieval && hsRetrieval.candidates.length > 0
        ? hsRetrieval.candidates
            .map(
              (c, idx) =>
                `${idx + 1}. HS ${c.hs_code}: ${c.description} (similarity: ${c.score}, computed tier: ${hsRetrieval.tier})`
            )
            .join("\n")
        : "Not applicable (Digital-only product).";

    const systemPrompt = `You are EUPass, an expert European Union trade, product safety, and AI regulatory compliance engine.
Last Verified Against EU Law: ${verifiedDate}.

Analyze the product and output a single JSON object strictly matching the responseSchema:
- Initial Router Classification: product_type="${routerResult.product_type}", has_ai=${routerResult.has_ai}.
- If product_type is "digital": set "hs" to null and "product_safety" to null. Populate "ai_act" and "checklist" (with pillar="ai_act").
- If product_type is "physical" (and has_ai is false): set "ai_act" to null. Populate "hs" (using the retrieved WCO 6-digit HS candidates below without inventing invalid codes), "product_safety" (GPSR Regulation (EU) 2023/988, EU Responsible Person, likely CE directives, and ESPR Digital Product Passport relevance), and "checklist" (with pillars "customs" and "product_safety").
- If product_type is "physical_with_ai": populate ALL THREE pillars ("hs", "ai_act", and "product_safety") and include checklist items across all three pillars. Use Annex I when AI is a safety/regulated component in CE-marked hardware (e.g., smart baby monitor, robot, toy, medical device) and Annex III for standalone high-risk biometric/employment/essential-service functions.
- PRIVACY RULE: Never quote raw user input verbatim in product_summary or rationale. Describe the product's function abstractly.
- Partner slots allowed in checklist items: "customs_broker_ioss", "eu_responsible_person", "ce_testing_lab", "dpp_traceability", "ai_act_conformity", or null.`;

    const contents: Array<Record<string, unknown> | string> = [];
    if (hasImage && input.image) {
      contents.push({
        inlineData: {
          data: input.image.buffer.toString("base64"),
          mimeType: input.image.mimeType,
        },
      });
    }
    contents.push(
      `Product Description:\n${input.description.trim()}\n\nRetrieved 6-Digit HS Candidates (Step B Grounding):\n${candidateGrounding}`
    );

    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: contents as never,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: euPassGenAiSchema,
        },
      });

      const rawText = (response.text || "").trim();
      const parsedJson = JSON.parse(rawText);
      const validated = euPassLlmResponseZodSchema.safeParse(parsedJson);
      if (validated.success) {
        llmResult = validated.data;
      } else {
        llmResult = buildDeterministicResponse(input.description, routerResult, hsRetrieval);
      }
    } catch {
      llmResult = buildDeterministicResponse(input.description, routerResult, hsRetrieval);
    }
  }

  // Enforce strict pillar presence invariants matching router determination
  if (llmResult.product_type === "digital") {
    llmResult.hs = null;
    llmResult.product_safety = null;
  } else if (!llmResult.has_ai) {
    llmResult.ai_act = null;
  }

  const commercial_invoice_snippet = llmResult.hs
    ? buildCommercialInvoiceSnippet(llmResult.hs.code, llmResult.hs.description)
    : null;

  return {
    ...llmResult,
    scan_id: `eupass_${Date.now().toString(36)}`,
    verified_date: verifiedDate,
    created_at: new Date().toISOString(),
    commercial_invoice_snippet,
  };
}
