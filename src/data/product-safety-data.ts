export interface ProductSafetyGuide {
  slug: string;
  title: string;
  regulationRef: string;
  effectiveDate: string;
  heroSummary: string;
  whoMustComply: string;
  keyRequirements: Array<{
    title: string;
    detail: string;
  }>;
  customsAndBorderImpact: string;
  checklistPreview: string[];
}

export const PRODUCT_SAFETY_GUIDES: ProductSafetyGuide[] = [
  {
    slug: "gpsr-guide",
    title: "EU General Product Safety Regulation (GPSR) Complete Guide",
    regulationRef: "Regulation (EU) 2023/988",
    effectiveDate: "13 December 2024 (In Force)",
    heroSummary:
      "The EU General Product Safety Regulation (GPSR) replaced the 2001 General Product Safety Directive on 13 December 2024. It applies to virtually every consumer physical product placed on the EU market—including e-commerce shipments from non-EU sellers in the US, UK, Australia, and Asia.",
    whoMustComply:
      "All manufacturers, importers, fulfillment service providers, and distance/online sellers offering consumer goods to customers in the EU27 or Northern Ireland, whether the product is new, used, repaired, or reconditioned.",
    keyRequirements: [
      {
        title: "Article 16 Mandatory EU Responsible Person",
        detail: "No consumer product covered by GPSR may be placed on the EU market unless an economic operator established in the EU (manufacturer, importer, Authorised Representative, or fulfillment provider) is designated and printed on the product/packaging.",
      },
      {
        title: "Article 9 Internal Risk Analysis & Technical Documentation",
        detail: "Manufacturers must draw up technical documentation containing a general description of the product and an analysis of possible physical, mechanical, chemical, or cybersecurity risks—and retain it for 10 years.",
      },
      {
        title: "Article 19 Distance Sales & Online Marketplace Listing Rules",
        detail: "Every e-commerce product page targeting EU buyers must visibly display: (1) manufacturer name, postal address, and electronic contact; (2) EU Responsible Person name, address, and email if the manufacturer is outside the EU; (3) product picture and batch/serial identifier; and (4) safety warnings in the official language of the destination Member State.",
      },
      {
        title: "Article 20 Safety Gate Rapid Alert Reporting",
        detail: "Economic operators must immediately notify national market surveillance authorities via the EU Safety Business Gateway if they know or should know a product poses an injury risk.",
      },
    ],
    customsAndBorderImpact:
      "EU customs authorities (under Market Surveillance Regulation (EU) 2019/1020 Articles 25–28) routinely suspend release for free circulation when parcels lack physical batch/serial numbers, manufacturer postal/electronic contact details, or an EU Responsible Person address.",
    checklistPreview: [
      "Appoint an EU-established Responsible Person (Article 16) before shipping to EU consumers.",
      "Compile a GPSR Article 9 Risk Assessment & Technical File (retained for 10 years).",
      "Print batch/model number, manufacturer contact, and EU Responsible Person address on product or packaging.",
      "Publish EU Responsible Person details and localized safety warnings on all Shopify/Amazon/eBay product listings.",
    ],
  },
  {
    slug: "eu-responsible-person",
    title: "EU Responsible Person & Authorised Representative Requirements",
    regulationRef: "MSR (EU) 2019/1020 Art. 4 & GPSR (EU) 2023/988 Art. 16",
    effectiveDate: "13 December 2024 (Universal Consumer Expansion)",
    heroSummary:
      "Previously required only for CE-marked products under Market Surveillance Regulation (EU) 2019/1020 Article 4, the EU Responsible Person mandate now extends to non-CE consumer goods (apparel, homeware, furniture, accessories) under GPSR Article 16.",
    whoMustComply:
      "Every non-EU brand, D2C e-commerce store, or exporter shipping direct-to-consumer (D2C) into the European Union without a commercial EU importer of record.",
    keyRequirements: [
      {
        title: "Written Mandate (Authorised Representative)",
        detail: "Non-EU manufacturers must sign a formal written mandate appointing an EU-established legal or natural person to act as their Authorised Representative and Responsible Person.",
      },
      {
        title: "Verification of Technical Documentation & EU DoC",
        detail: "The Responsible Person must verify that the EU Declaration of Conformity (or GPSR risk analysis) and technical documentation have been drawn up and keep them at the disposal of market surveillance authorities.",
      },
      {
        title: "Physical Labeling & Digital Listing Disclosure",
        detail: "The Responsible Person's name, registered trade name, postal address in the EU27, and email/electronic address must appear on the product, its packaging, the parcel, or an accompanying document—AND on the online checkout page.",
      },
    ],
    customsAndBorderImpact:
      "Amazon EU, Zalando, eBay, and EU customs border posts actively block SKUs and detain parcels that lack a verifiable EU27 Responsible Person address.",
    checklistPreview: [
      "Execute a written GPSR/MSR Authorised Representative mandate with an EU27 entity.",
      "Upload your Technical File, test reports, and Risk Assessment to your EU Responsible Person portal.",
      "Add the 'EU RP:' address block to your product packaging artwork and commercial invoice.",
    ],
  },
  {
    slug: "ce-marking-directives",
    title: "CE Marking Directives, Technical Files & EU Declaration of Conformity",
    regulationRef: "Decision No 768/2008/EC & New Legislative Framework (NLF)",
    effectiveDate: "Active (Updated for RED Cybersecurity & Machinery 2026–2027)",
    heroSummary:
      "CE marking is mandatory ONLY for product categories covered by specific EU harmonization legislation (such as electronics, radio/wireless devices, toys, machinery, PPE, and medical devices). Affixing a CE mark to a non-CE product (like a cotton t-shirt or ceramic mug) is illegal.",
    whoMustComply:
      "Manufacturers and importers of electrical equipment (LVD/EMC/RoHS), wireless/Bluetooth/Wi-Fi devices (RED), toys (Directive 2009/48/EC), machinery, personal protective equipment (PPE), and medical devices.",
    keyRequirements: [
      {
        title: "Identify All Overlapping Directives",
        detail: "A single smart product (e.g., a Bluetooth baby monitor) often triggers multiple directives simultaneously: Radio Equipment Directive (RED 2014/53/EU), RoHS (2011/65/EU), Ecodesign, Battery Regulation (2023/1542), and the EU AI Act.",
      },
      {
        title: "Harmonized EN Standards Testing",
        detail: "Test the product against Harmonized European Standards (EN/ETSI/CENELEC) published in the Official Journal of the EU to gain a presumption of conformity.",
      },
      {
        title: "Single EU Declaration of Conformity (DoC)",
        detail: "Draw up and sign a single EU Declaration of Conformity listing all applicable Union directives/regulations, harmonized standards applied, and the EU Authorised Representative.",
      },
      {
        title: "CE Logo Proportions & Traceability",
        detail: "Affix the official CE mark (minimum 5 mm height, indelible and visible) alongside WEEE crossed-out wheeled bin symbols where applicable.",
      },
    ],
    customsAndBorderImpact:
      "Customs inspects HS Chapters 84, 85, 90, 94, and 95 for valid CE marking and requests the EU Declaration of Conformity prior to customs release.",
    checklistPreview: [
      "Map your 6-digit HS code to applicable EU New Legislative Framework (NLF) CE directives.",
      "Obtain EN harmonized standard test reports (EMC, LVD safety, RED RF spectrum, RoHS chemical limits).",
      "Draft and sign a unified EU Declaration of Conformity (DoC).",
      "Affix the 5mm+ CE mark, WEEE symbol, and EU Responsible Person details to the product rating label.",
    ],
  },
  {
    slug: "digital-product-passport",
    title: "EU Digital Product Passport (DPP) & Ecodesign (ESPR) Guide",
    regulationRef: "Regulation (EU) 2024/1781 (ESPR) & Battery Regulation (EU) 2023/1542",
    effectiveDate: "Phased Delegated Acts 2026–2030 (Batteries: 18 Feb 2027)",
    heroSummary:
      "Under the Ecodesign for Sustainable Products Regulation (ESPR) (EU) 2024/1781, the European Union is rolling out mandatory QR-linked Digital Product Passports (DPPs) across priority physical product groups including textiles/apparel, batteries, electronics, furniture, iron/steel, and aluminium.",
    whoMustComply:
      "Economic operators placing priority-group physical goods on the EU market—starting with industrial/EV/LMT batteries (February 2027), followed by apparel/textiles (HS Chapters 50–63), iron/steel (Chapter 72), furniture (Chapter 94), and consumer electronics (Chapters 84–85).",
    keyRequirements: [
      {
        title: "Data Carrier (QR Code / NFC Tag) on Product",
        detail: "Each product batch or item must carry a scannable data carrier linked to a persistent unique product identifier (ISO/IEC 15459 compliant).",
      },
      {
        title: "Structured Sustainability, Repairability & Material Disclosures",
        detail: "The DPP must expose machine-readable data on recycled content percentage, carbon footprint, substances of concern (REACH SVHCs), repair manuals, and end-of-life recycling instructions.",
      },
      {
        title: "Central EU DPP Registry Verification at Customs",
        detail: "Under ESPR Article 13, the unique DPP registration identifier will be cross-checked automatically in the EU Customs Single Window environment upon import.",
      },
      {
        title: "Ban on Destruction of Unsold Apparel & Footwear",
        detail: "ESPR introduces direct transparency disclosures and bans on the destruction of unsold consumer textiles and footwear (HS Chapters 61, 62, 64) for large and medium enterprises.",
      },
    ],
    customsAndBorderImpact:
      "Once a product group's ESPR delegated act enters into force, EU customs systems will verify the Digital Product Passport registry ID electronically before releasing goods for free circulation.",
    checklistPreview: [
      "Check whether your HS chapter falls in the ESPR First Working Plan priority groups (Textiles, Batteries, Electronics, Furniture, Steel).",
      "Audit supply-chain bill of materials (BoM) for REACH Substances of Very High Concern (SVHCs > 0.1% w/w).",
      "Reserve a QR code / GS1 Digital Link zone on your garment care label or hardware rating plate.",
    ],
  },
  {
    slug: "ioss-vat-threshold",
    title: "EU €150 IOSS, Customs Duty Threshold & Commercial Invoice Rules",
    regulationRef: "Council Directive (EU) 2017/2455 & Union Customs Code (UCC)",
    effectiveDate: "Active (ICS2 Release 3 Mandatory)",
    heroSummary:
      "When shipping physical goods into the European Union from a non-EU country, the €150 intrinsic value threshold determines whether your shipment qualifies for Import One-Stop Shop (IOSS) green-channel clearance and 0% customs duty—or triggers formal customs brokerage.",
    whoMustComply:
      "All cross-border e-commerce merchants, Shopify/WooCommerce stores, and B2B exporters shipping physical parcels into the EU.",
    keyRequirements: [
      {
        title: "Intrinsic Value ≤ €150 (IOSS Fast-Track)",
        detail: "Consignments with an intrinsic goods value (excluding shipping and insurance if itemized separately) of €150 or less are exempt from EU customs duty. If you collect destination-country VAT at checkout via an IOSS number, the parcel clears EU customs with zero surprise carrier handling fees for the buyer.",
      },
      {
        title: "Intrinsic Value > €150 (Standard Import VAT + TARIC Duty)",
        detail: "Consignments exceeding €150 cannot use IOSS. Both import VAT and the applicable 10-digit TARIC customs duty rate apply at the border (shipped DDP via carrier account or DAP paid by recipient).",
      },
      {
        title: "Mandatory 6-Digit HS Code & Plain-Language Description (ICS2)",
        detail: "Under the EU Import Control System 2 (ICS2), every commercial invoice and electronic Entry Summary Declaration (ENS) must include at least the 6-digit WCO Harmonized System code and a precise commercial description (vague terms like 'gift', 'apparel', or 'samples' are automatically rejected).",
      },
    ],
    customsAndBorderImpact:
      "Missing or inaccurate 6-digit HS codes trigger automated ICS2 stop-flags, carrier surcharges, and customs delays across DHL, FedEx, UPS, and postal networks.",
    checklistPreview: [
      "Include the exact 6-digit WCO HS code and material/function description on every commercial invoice.",
      "Display your 12-character EU IOSS VAT identification number in the electronic customs manifest (EAD) for orders ≤ €150.",
      "Itemize freight and insurance separately from intrinsic product value on the commercial invoice.",
    ],
  },
  {
    slug: "cyber-resilience-act",
    title: "EU Cyber Resilience Act (CRA) for Connected Hardware & Software",
    regulationRef: "Regulation (EU) 2024/2847",
    effectiveDate: "Reporting: 11 Sept 2026 | Full Application: 11 Dec 2027",
    heroSummary:
      "The EU Cyber Resilience Act (CRA) establishes mandatory horizontal cybersecurity requirements for all 'products with digital elements' (connected hardware and standalone software whose intended use includes a direct or indirect data connection to a device or network).",
    whoMustComply:
      "Manufacturers, developers, and importers of IoT devices, smart cameras, routers, wearables, operating systems, and connected consumer or industrial hardware.",
    keyRequirements: [
      {
        title: "Secure by Default Configuration (Annex I Part I)",
        detail: "Products must ship with no known exploitable vulnerabilities, unique/resettable passwords (no universal default passwords), encryption of data at rest and in transit, and minimal attack surface.",
      },
      {
        title: "5-Year Vulnerability Handling & Software Bill of Materials (SBOM)",
        detail: "Manufacturers must maintain a machine-readable SBOM, provide free security patches throughout the support period (typically at least 5 years), and establish a Coordinated Vulnerability Disclosure (CVD) policy.",
      },
      {
        title: "24-Hour ENISA Early Warning Reporting",
        detail: "From 11 September 2026, manufacturers must report actively exploited vulnerabilities and severe cyber incidents to ENISA and the designated CSIRT within 24 hours of awareness.",
      },
    ],
    customsAndBorderImpact:
      "CRA compliance is enforced via the CE marking on connected products; non-compliant connected devices face EU market withdrawal and penalties up to €15,000,000 or 2.5% of worldwide turnover.",
    checklistPreview: [
      "Generate a machine-readable Software Bill of Materials (SBOM) in CycloneDX or SPDX format.",
      "Eliminate hardcoded credentials and enforce authenticated OTA firmware updates.",
      "Register ENISA 24-hour vulnerability reporting workflows ahead of the September 2026 deadline.",
    ],
  },
];

export function getAllProductSafetyGuides(): ProductSafetyGuide[] {
  return PRODUCT_SAFETY_GUIDES;
}

export function getProductSafetyGuide(slug: string): ProductSafetyGuide | null {
  return PRODUCT_SAFETY_GUIDES.find((g) => g.slug === slug) ?? null;
}
