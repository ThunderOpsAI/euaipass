export interface PartnerConfig {
  slot: string;
  name: string;
  tagline: string;
  ctaLabel: string;
  url: string;
  pillar: "customs" | "ai_act" | "product_safety";
}

export const PARTNERS: Record<string, PartnerConfig> = {
  customs_broker_ioss: {
    slot: "customs_broker_ioss",
    name: "EuroClear IOSS & Customs Desk",
    tagline: "Automated EU Import One-Stop Shop (IOSS) VAT registration & Binding Tariff Information (BTI) filing.",
    ctaLabel: "Register IOSS & Verify HS Code",
    url: "https://euaipass.com/out/euroclear-ioss?ref=eupass_checklist",
    pillar: "customs",
  },
  eu_responsible_person: {
    slot: "eu_responsible_person",
    name: "AuthorisedRep Europe (GPSR & CE)",
    tagline: "Appoint an Article 16 EU Responsible Person in Dublin or Frankfurt within 24 hours for GPSR & CE compliance.",
    ctaLabel: "Appoint EU Responsible Person",
    url: "https://euaipass.com/out/authorisedrep-eu?ref=eupass_checklist",
    pillar: "product_safety",
  },
  ce_testing_lab: {
    slot: "ce_testing_lab",
    name: "TestLab EU Conformity & RED/EMC",
    tagline: "Accredited EN ISO/IEC 17025 laboratory testing and Technical File review for CE Marking directives.",
    ctaLabel: "Request CE Lab Quote",
    url: "https://euaipass.com/out/testlab-eu?ref=eupass_checklist",
    pillar: "product_safety",
  },
  dpp_traceability: {
    slot: "dpp_traceability",
    name: "TracePass EU Digital Product Passport",
    tagline: "Generate ESPR-ready QR Digital Product Passports for textiles, batteries, and electronics.",
    ctaLabel: "Generate QR Product Passport",
    url: "https://euaipass.com/out/tracepass-dpp?ref=eupass_checklist",
    pillar: "product_safety",
  },
  ai_act_conformity: {
    slot: "ai_act_conformity",
    name: "AIGovern EU Annex III Dossier & FRIA",
    tagline: "Automated Article 11 Technical Documentation, Article 9 Risk Management, and EU AI Database registration.",
    ctaLabel: "Build Annex III Technical File",
    url: "https://euaipass.com/out/aigovern-eu?ref=eupass_checklist",
    pillar: "ai_act",
  },
};

export function getPartnerBySlot(slot?: string | null): PartnerConfig | null {
  if (!slot) return null;
  return PARTNERS[slot] ?? null;
}
