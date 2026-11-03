import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { EuPassScanResult } from "@/lib/schema";

const COLORS = {
  primary: "#003399",
  primaryDark: "#002266",
  primaryLight: "#E8EEF9",
  navy: "#0F172A",
  slateDark: "#1E293B",
  slateMedium: "#475569",
  slateLight: "#64748B",
  border: "#CBD5E1",
  borderLight: "#E2E8F0",
  surfaceLight: "#F8FAFC",
  white: "#FFFFFF",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    lineHeight: 1.4,
    color: COLORS.slateDark,
    backgroundColor: COLORS.white,
    paddingTop: 32,
    paddingBottom: 44,
    paddingHorizontal: 34,
  },
  headerContainer: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    paddingBottom: 12,
    marginBottom: 14,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  superTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: COLORS.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  },
  title: {
    fontSize: 17,
    fontFamily: "Helvetica-Bold",
    color: COLORS.navy,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 8.5,
    color: COLORS.slateMedium,
  },
  metaCard: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 4,
    padding: 8,
    minWidth: 170,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  metaLabel: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: COLORS.slateLight,
  },
  metaValue: {
    fontSize: 7.5,
    color: COLORS.slateDark,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: COLORS.navy,
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    paddingBottom: 3,
    marginBottom: 6,
  },
  card: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 4,
    padding: 9,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: COLORS.primaryDark,
    marginBottom: 3,
  },
  cardBody: {
    fontSize: 8.5,
    color: COLORS.slateDark,
    marginBottom: 2,
  },
  invoiceBox: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#94A3B8",
    borderRadius: 4,
    padding: 8,
    marginTop: 4,
  },
  checkItem: {
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 4,
    padding: 8,
    marginBottom: 5,
    flexDirection: "row",
    gap: 8,
  },
  checkbox: {
    width: 11,
    height: 11,
    borderWidth: 1,
    borderColor: COLORS.slateMedium,
    marginTop: 1,
  },
  disclaimerBox: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    borderLeftWidth: 4,
    borderLeftColor: "#DC2626",
    borderRadius: 4,
    padding: 9,
    marginTop: 8,
  },
  disclaimerTitle: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#991B1B",
    marginBottom: 3,
    textTransform: "uppercase",
  },
  disclaimerText: {
    fontSize: 7.5,
    color: "#7F1D1D",
    lineHeight: 1.35,
  },
  footer: {
    position: "absolute",
    bottom: 18,
    left: 34,
    right: 34,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7,
    color: COLORS.slateLight,
  },
});

export interface EuPassReportDocumentProps {
  result: EuPassScanResult;
  verifiedDate?: string;
}

export const EuPassReportDocument: React.FC<EuPassReportDocumentProps> = ({
  result,
  verifiedDate,
}) => {
  const effectiveVerifiedDate = verifiedDate || result.verified_date || "2026-10-01";

  return (
    <Document
      title={`EUPass Market Entry Report - ${result.scan_id}`}
      author="EUPass — EU Market Entry & Compliance Hub"
      subject="EU Customs, AI Act & Product Safety Compliance Report"
    >
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.headerContainer} wrap={false}>
          <View style={styles.headerTopRow}>
            <View style={{ maxWidth: "62%" }}>
              <Text style={styles.superTitle}>EUPass Free Compliance Dossier</Text>
              <Text style={styles.title}>EU Market Entry & Regulatory Report</Text>
              <Text style={styles.subtitle}>{result.product_summary}</Text>
            </View>
            <View style={styles.metaCard}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Scan ID:</Text>
                <Text style={styles.metaValue}>{result.scan_id}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Route Type:</Text>
                <Text style={styles.metaValue}>{result.product_type}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Last Verified:</Text>
                <Text style={styles.metaValue}>{effectiveVerifiedDate}</Text>
              </View>
            </View>
          </View>
        </View>

        {result.hs ? (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Pillar 1: EU Customs & WCO 6-Digit HS Classification</Text>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                HS Code {result.hs.code} — Confidence Tier: {result.hs.confidence_tier.toUpperCase()}
                {result.hs.review_recommended ? " (Broker Review Recommended)" : ""}
              </Text>
              <Text style={styles.cardBody}>WCO Description: {result.hs.description}</Text>
              <Text style={styles.cardBody}>Rationale: {result.hs.rationale}</Text>
              {result.commercial_invoice_snippet ? (
                <View style={styles.invoiceBox}>
                  <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", marginBottom: 2 }}>
                    Commercial Invoice & EUR 150 IOSS/VAT Snippet:
                  </Text>
                  <Text style={{ fontSize: 7.5 }}>{result.commercial_invoice_snippet}</Text>
                </View>
              ) : null}
            </View>
          </View>
        ) : null}

        {result.ai_act ? (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>
              Pillar 2: EU AI Act (Regulation (EU) 2024/1689) Classification
            </Text>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                Risk Tier: {result.ai_act.risk_tier} Risk ({result.ai_act.matched_article})
              </Text>
              <Text style={styles.cardBody}>Category: {result.ai_act.matched_category}</Text>
              <Text style={styles.cardBody}>Scope: {result.ai_act.annex_scope}</Text>
              <Text style={styles.cardBody}>Rationale: {result.ai_act.rationale}</Text>
            </View>
          </View>
        ) : null}

        {result.product_safety ? (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>
              Pillar 3: EU Product Safety (GPSR, CE Directives & Digital Product Passport)
            </Text>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                GPSR Applies: {result.product_safety.gpsr_applies ? "Yes (EU Responsible Person Required)" : "No"} | DPP/ESPR Flag:{" "}
                {result.product_safety.dpp_espr_flag ? "Priority Scope" : "Standard"}
              </Text>
              <Text style={styles.cardBody}>{result.product_safety.traceability_summary}</Text>
              <Text style={styles.cardBody}>
                Likely Directives: {result.product_safety.likely_ce_directives.join("; ")}
              </Text>
              <Text style={styles.cardBody}>DPP Note: {result.product_safety.dpp_note}</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Actionable EU Market Readiness Checklist ({result.checklist.length} Steps)
          </Text>
          {result.checklist.map((item, idx) => (
            <View key={item.id || idx} style={styles.checkItem} wrap={false}>
              <View style={styles.checkbox} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold", color: COLORS.navy }}>
                  [{item.pillar.toUpperCase()} • {item.priority}] {item.title}
                </Text>
                <Text style={{ fontSize: 8, color: COLORS.slateMedium, marginTop: 2 }}>
                  {item.detail}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.disclaimerBox} wrap={false}>
          <Text style={styles.disclaimerTitle}>
            Mandatory Notice: Not Legal or Customs Advice
          </Text>
          <Text style={styles.disclaimerText}>
            NOT LEGAL/CUSTOMS ADVICE — This report is generated by an automated regulatory readiness tool for
            informational purposes only. It does not constitute formal legal counsel, Binding Tariff Information (BTI),
            customs brokerage advice, or a Notified Body conformity certificate under Regulation (EU) 2024/1689,
            Regulation (EU) 2023/988 (GPSR), or the Union Customs Code. Last verified against EU regulations on{" "}
            {effectiveVerifiedDate}. Raw user inputs are processed strictly in-memory and are never stored.
          </Text>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            EUPass Free Compliance Hub • Last Verified: {effectiveVerifiedDate} • Not Legal/Customs Advice
          </Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
};
