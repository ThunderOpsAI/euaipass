export interface AiActGuidePage {
  slug: string;
  section: "article-5" | "annex-iii" | "annex-i";
  articleRef: string;
  title: string;
  riskTier: "Unacceptable" | "High";
  enforcementDeadline: string;
  maxPenalty: string;
  summary: string;
  statutoryScope: string;
  technicalExamples: string[];
  obligations: Array<{
    article: string;
    title: string;
    detail: string;
  }>;
  exemptionsAndEdgeCases: string;
}

export const ARTICLE_5_PRACTICES: AiActGuidePage[] = [
  {
    slug: "subliminal-manipulation",
    section: "article-5",
    articleRef: "Article 5(1)(a)",
    title: "Subliminal, Manipulative & Deceptive AI Techniques",
    riskTier: "Unacceptable",
    enforcementDeadline: "2 February 2025 (In Force)",
    maxPenalty: "Up to €35,000,000 or 7% of worldwide annual turnover",
    summary:
      "Article 5(1)(a) of Regulation (EU) 2024/1689 prohibits placing on the market, putting into service, or using an AI system that deploys subliminal components beyond a person's consciousness or purposefully manipulative or deceptive techniques to materially distort human behavior and cause significant harm.",
    statutoryScope:
      "Applies to any AI-driven user interface, neuro-adaptive system, or dark-pattern persuasion engine that subverts individual autonomy so that users take actions they would not otherwise take, resulting in reasonably likely physical, psychological, or financial harm.",
    technicalExamples: [
      "Inaudible audio or sub-perceptual visual stimuli embedded in streaming media to trigger compulsive purchases.",
      "Deceptive conversational AI agents that impersonate trusted relatives or authority figures to coerce financial transfers.",
      "Addictive algorithmic dark patterns engineered to induce severe sleep deprivation or self-harm.",
    ],
    obligations: [
      {
        article: "Article 5(1)(a)",
        title: "Absolute EU Market Prohibition",
        detail: "Immediately cease development, market placement, or operation of subliminal or purposefully deceptive behavioral distortion components within the European Union.",
      },
      {
        article: "Article 99(3)",
        title: "Board-Level Non-Compliance Exposure Audit",
        detail: "Verify that recommendation and personalization algorithms optimize transparent user preferences rather than covert behavioral coercion.",
      },
    ],
    exemptionsAndEdgeCases:
      "Lawful, transparent commercial advertising, persuasion, and medically supervised therapeutic interventions with explicit informed patient consent do not fall under Article 5(1)(a) provided they do not use covert subliminal manipulation.",
  },
  {
    slug: "vulnerability-exploitation",
    section: "article-5",
    articleRef: "Article 5(1)(b)",
    title: "Exploitation of Age, Disability, or Socio-Economic Vulnerabilities",
    riskTier: "Unacceptable",
    enforcementDeadline: "2 February 2025 (In Force)",
    maxPenalty: "Up to €35,000,000 or 7% of worldwide annual turnover",
    summary:
      "Article 5(1)(b) prohibits AI systems that exploit vulnerabilities of a specific person or group of persons due to their age, disability, or a specific social or economic situation, with the objective or effect of materially distorting their behavior in a manner causing significant harm.",
    statutoryScope:
      "Covers both digital applications and connected toys or consumer hardware targeting children, elderly individuals with cognitive decline, persons with disabilities, or individuals in extreme financial distress.",
    technicalExamples: [
      "AI-powered smart toys that manipulate young children into dangerous physical challenges or unauthorized microtransactions.",
      "Predatory credit or gambling targeting algorithms that specifically identify low-income or cognitively impaired individuals to push high-risk products.",
    ],
    obligations: [
      {
        article: "Article 5(1)(b)",
        title: "Prohibition on Vulnerability Targeting",
        detail: "Remove targeting features and behavioral reward loops that leverage age, disability, or socio-economic distress.",
      },
      {
        article: "Toy Safety Directive 2009/48/EC & Annex I",
        title: "Child-Safe Hardware & AI Guardrails",
        detail: "If the AI is embedded in a physical toy, ensure strict compliance with both Article 5(1)(b) and Annex I CE safety rules.",
      },
    ],
    exemptionsAndEdgeCases:
      "Assistive accessibility technologies, age-appropriate educational tutors, and financial inclusion tools that benefit vulnerable users without causing harm are encouraged and lawful.",
  },
  {
    slug: "social-scoring",
    section: "article-5",
    articleRef: "Article 5(1)(c)",
    title: "Social Scoring of Natural Persons",
    riskTier: "Unacceptable",
    enforcementDeadline: "2 February 2025 (In Force)",
    maxPenalty: "Up to €35,000,000 or 7% of worldwide annual turnover",
    summary:
      "Article 5(1)(c) bans AI systems used by public or private actors for evaluating or classifying natural persons or groups over a certain period based on their social behavior or known, inferred, or predicted personal or personality characteristics.",
    statutoryScope:
      "Triggered when a social score leads to either (i) detrimental or unfavorable treatment in social contexts unrelated to the context in which the data was originally generated, or (ii) detrimental treatment that is unjustified or disproportionate to the gravity of their social behavior.",
    technicalExamples: [
      "Municipal or corporate citizen trustworthiness scores combining social media posts, civic infractions, and shopping habits to restrict access to transport or housing.",
      "Cross-platform tenant blacklisting models that penalize applicants based on unrelated lifestyle or political activity.",
    ],
    obligations: [
      {
        article: "Article 5(1)(c)",
        title: "Decommission Cross-Context Social Scoring",
        detail: "Eliminate any cross-context behavioral aggregation that produces a generalized personal trustworthiness score.",
      },
      {
        article: "Annex III Point 5(b)",
        title: "Transition Legitimate Credit Scoring to High-Risk Controls",
        detail: "If evaluating strictly financial creditworthiness using relevant financial data, reclassify under Annex III Point 5(b) and implement Articles 9–15.",
      },
    ],
    exemptionsAndEdgeCases:
      "Single-context fraud detection, security anomaly scoring, and lawful financial creditworthiness assessments using strictly relevant financial history are not prohibited social scoring (though credit scoring is High-Risk under Annex III).",
  },
  {
    slug: "criminal-risk-profiling",
    section: "article-5",
    articleRef: "Article 5(1)(d)",
    title: "Individual Criminal Offense Risk Prediction via Profiling",
    riskTier: "Unacceptable",
    enforcementDeadline: "2 February 2025 (In Force)",
    maxPenalty: "Up to €35,000,000 or 7% of worldwide annual turnover",
    summary:
      "Article 5(1)(d) prohibits AI systems that make risk assessments of natural persons in order to assess or predict the risk of a natural person committing a criminal offense, based solely on the profiling of a natural person or on assessing their personality traits and characteristics.",
    statutoryScope:
      "Bans 'predictive policing' on individuals where the determination rests solely on demographic, psychological, or personality profiling without objective, verifiable facts directly linked to a specific criminal activity.",
    technicalExamples: [
      "Pre-crime scoring tools that flag individuals as likely future offenders based solely on psychometric traits, family background, or neighborhood demographics.",
    ],
    obligations: [
      {
        article: "Article 5(1)(d)",
        title: "Ban Sole-Profiling Crime Prediction",
        detail: "Prohibit automated criminal propensity scoring that operates without a preexisting, objective factual link to criminal investigation.",
      },
    ],
    exemptionsAndEdgeCases:
      "AI systems used to support human assessment of a person's involvement in a criminal activity that is already based on objective and verifiable facts directly linked to a criminal offense are excluded from Article 5(1)(d) and instead regulated as High-Risk under Annex III Point 6(d).",
  },
  {
    slug: "untargeted-facial-scraping",
    section: "article-5",
    articleRef: "Article 5(1)(e)",
    title: "Untargeted Scraping of Facial Images from Internet or CCTV",
    riskTier: "Unacceptable",
    enforcementDeadline: "2 February 2025 (In Force)",
    maxPenalty: "Up to €35,000,000 or 7% of worldwide annual turnover",
    summary:
      "Article 5(1)(e) prohibits placing on the market, putting into service for this specific purpose, or using AI systems that create or expand facial recognition databases through the untargeted scraping of facial images from the internet or CCTV footage.",
    statutoryScope:
      "Targets mass biometric harvesting pipelines (e.g., Clearview-style web crawlers or indiscriminate public camera ingestion) that index billions of faces without consent or targeted legal basis.",
    technicalExamples: [
      "Web crawlers harvesting social media photos to build a searchable face-embedding vector index.",
      "Retail or city CCTV pipelines automatically enrolling every passerby's face into a persistent biometric lookup database.",
    ],
    obligations: [
      {
        article: "Article 5(1)(e) & GDPR Art. 9",
        title: "Purge Scraped Biometric Indexes",
        detail: "Terminate untargeted facial scraping pipelines and purge any biometric embeddings derived from non-consensual internet or CCTV scraping.",
      },
    ],
    exemptionsAndEdgeCases:
      "Curated, opt-in biometric datasets where data subjects have given explicit GDPR Article 9 consent for identity verification or model testing are not untargeted scraping.",
  },
  {
    slug: "workplace-education-emotion-recognition",
    section: "article-5",
    articleRef: "Article 5(1)(f)",
    title: "Emotion Recognition in Workplaces and Educational Institutions",
    riskTier: "Unacceptable",
    enforcementDeadline: "2 February 2025 (In Force)",
    maxPenalty: "Up to €35,000,000 or 7% of worldwide annual turnover",
    summary:
      "Article 5(1)(f) prohibits AI systems that infer emotions of a natural person in the areas of workplace and education institutions, except where the use of the AI system is intended to be put in place or into the market for medical or safety reasons.",
    statutoryScope:
      "Bans webcam, voice-tone, or biometric sentiment/emotion inference on employees, job candidates, or students due to severe power asymmetry and scientific unreliability of emotion inference.",
    technicalExamples: [
      "Video interview software scoring job applicants on facial micro-expressions, enthusiasm, or anxiety.",
      "Call-center employee monitoring tools tracking agent frustration or emotional fatigue for disciplinary KPIs.",
      "Classroom webcam software tracking student boredom or engagement levels.",
    ],
    obligations: [
      {
        article: "Article 5(1)(f)",
        title: "Disable Affective/Emotion Inference in HR & EdTech",
        detail: "Strip facial expression, vocal sentiment, and affective state classifiers from recruitment, employee monitoring, and classroom software.",
      },
    ],
    exemptionsAndEdgeCases:
      "Strictly safety-critical or medical uses—such as detecting severe drowsiness or micro-sleep in commercial truck drivers or pilots—are explicitly permitted under the safety/medical exception.",
  },
  {
    slug: "sensitive-biometric-categorization",
    section: "article-5",
    articleRef: "Article 5(1)(g)",
    title: "Biometric Categorization Inferring Sensitive Protected Attributes",
    riskTier: "Unacceptable",
    enforcementDeadline: "2 February 2025 (In Force)",
    maxPenalty: "Up to €35,000,000 or 7% of worldwide annual turnover",
    summary:
      "Article 5(1)(g) prohibits biometric categorization systems that categorize individually natural persons based on their biometric data to deduce or infer their race, political opinions, trade union membership, religious or philosophical beliefs, sex life, or sexual orientation.",
    statutoryScope:
      "Applies to any computer vision, voice, or physiological biometric model that infers GDPR Article 9 special-category attributes from biometric inputs.",
    technicalExamples: [
      "Camera analytics classifying visitors by inferred ethnicity, religious affiliation, or sexual orientation.",
    ],
    obligations: [
      {
        article: "Article 5(1)(g)",
        title: "Eliminate Protected-Attribute Biometric Classifiers",
        detail: "Remove protected-trait inference heads from biometric vision or audio pipelines before EU deployment.",
      },
    ],
    exemptionsAndEdgeCases:
      "Lawfully acquired biometric datasets labeled for the sole purpose of bias auditing, fairness testing, or statutory law-enforcement filtering are exempted where strictly compliant with Union law.",
  },
  {
    slug: "real-time-remote-biometric-identification",
    section: "article-5",
    articleRef: "Article 5(1)(h)",
    title: "Real-Time Remote Biometric Identification in Public Spaces",
    riskTier: "Unacceptable",
    enforcementDeadline: "2 February 2025 (In Force)",
    maxPenalty: "Up to €35,000,000 or 7% of worldwide annual turnover",
    summary:
      "Article 5(1)(h) prohibits the use of 'real-time' remote biometric identification (RBI) systems in publicly accessible spaces for the purposes of law enforcement, unless and in as far as such use is strictly necessary for one of three narrow statutory objectives with prior judicial authorization.",
    statutoryScope:
      "Applies to live video/biometric matching against watchlists in streets, train stations, stadiums, and retail spaces for law enforcement.",
    technicalExamples: [
      "Live municipal CCTV facial recognition scanning crowds in real time without a specific judicial warrant.",
    ],
    obligations: [
      {
        article: "Article 5(1)(h) & Article 5(2)–(7)",
        title: "Judicial Warrant & Fundamental Rights Safeguards",
        detail: "Restrict real-time RBI strictly to authorized kidnapping searches, imminent terrorist threat prevention, or serious Annex II crimes with prior judicial authorization.",
      },
    ],
    exemptionsAndEdgeCases:
      "Post-event (retrospective) biometric identification and private-sector physical access control (e.g., opt-in employee badgeless door entry) are not Article 5(1)(h) real-time law enforcement RBI, though remote biometric identification is High-Risk under Annex III Point 1(a).",
  },
];

export const ANNEX_III_CATEGORIES: AiActGuidePage[] = [
  {
    slug: "biometrics",
    section: "annex-iii",
    articleRef: "Annex III Point 1",
    title: "Biometrics: Remote Identification, Categorization & Emotion Recognition",
    riskTier: "High",
    enforcementDeadline: "2 August 2026",
    maxPenalty: "Up to €15,000,000 or 3% of worldwide annual turnover",
    summary:
      "Annex III Point 1 designates as High-Risk any remote biometric identification system (excluding single-factor identity verification), permitted biometric categorization systems, and emotion recognition systems used outside workplaces and schools.",
    statutoryScope:
      "Covers software and smart cameras performing one-to-many biometric identification, facial recognition alerts, or non-prohibited emotion recognition in consumer or security settings.",
    technicalExamples: [
      "Smart baby monitors or home security cameras with facial recognition and emotion/distress detection.",
      "Retrospective video forensic biometric matching systems.",
      "Retail customer emotion analytics (where permitted outside workplace/education).",
    ],
    obligations: [
      { article: "Article 9 & 10", title: "Risk Management & Biometric Data Governance", detail: "Maintain continuous risk mitigation and bias auditing across demographic groups." },
      { article: "Article 11 & 43", title: "Technical Documentation & Third-Party Conformity Assessment", detail: "Note: Annex III Point 1 biometric systems often require Notified Body involvement unless fully applying harmonized standards." },
      { article: "Article 14 & 26", title: "Dual-Person Verification (" + '"Four-Eyes"' + " Rule)", detail: "Ensure no action or decision is taken by the deployer solely on the basis of the identification result unless separately verified by at least two natural persons." },
    ],
    exemptionsAndEdgeCases:
      "AI systems intended to be used strictly for biometric verification—whose sole purpose is confirming that a specific natural person is the person they claim to be (1:1 authentication such as unlocking a phone)—are explicitly excluded from Annex III Point 1(a).",
  },
  {
    slug: "critical-infrastructure",
    section: "annex-iii",
    articleRef: "Annex III Point 2",
    title: "Critical Infrastructure: Digital Networks, Road Traffic, Water, Gas & Electricity",
    riskTier: "High",
    enforcementDeadline: "2 August 2026",
    maxPenalty: "Up to €15,000,000 or 3% of worldwide annual turnover",
    summary:
      "Annex III Point 2 classifies as High-Risk AI systems intended to be used as safety components in the management and operation of critical digital infrastructure, road traffic, or in the supply of water, gas, heating, or electricity.",
    statutoryScope:
      "Applies where failure or malfunction of the AI component could put the life and health of persons at risk or cause appreciable disruption to critical utility or traffic operations.",
    technicalExamples: [
      "AI-driven smart grid load-balancing and substation fault-isolation controllers.",
      "Automated highway traffic signalling and congestion safety management systems.",
      "Municipal water pressure and contamination shutoff control models.",
    ],
    obligations: [
      { article: "Article 9 & 15", title: "Safety Resilience, Redundancy & Cybersecurity", detail: "Implement fail-safe fallback modes, adversarial robustness, and physical/cyber resilience controls." },
      { article: "Article 12", title: "Immutable Automated Event Logging", detail: "Record telemetry and decision traces throughout the operational lifecycle." },
    ],
    exemptionsAndEdgeCases:
      "Back-office billing, administrative scheduling, or non-safety predictive maintenance analytics that cannot directly actuate or jeopardize critical infrastructure safety do not fall under Point 2.",
  },
  {
    slug: "education-vocational-training",
    section: "annex-iii",
    articleRef: "Annex III Point 3",
    title: "Education & Vocational Training: Admissions, Grading & Exam Proctoring",
    riskTier: "High",
    enforcementDeadline: "2 August 2026",
    maxPenalty: "Up to €15,000,000 or 3% of worldwide annual turnover",
    summary:
      "Annex III Point 3 covers AI systems used to determine admission or assignment to educational institutions, evaluate learning outcomes, assess appropriate education levels, or monitor student behavior during exams.",
    statutoryScope:
      "Protects the right to education and non-discrimination when algorithmic scoring influences academic progression or disciplinary cheating flags.",
    technicalExamples: [
      "Automated university admissions ranking and scholarship filtering platforms.",
      "AI essay and exam grading engines that determine official student grades or placement.",
      "Remote exam proctoring software analyzing gaze, keystrokes, or room audio to flag academic dishonesty.",
    ],
    obligations: [
      { article: "Article 10 & 13", title: "Pedagogical Bias Testing & Transparency Instructions", detail: "Provide schools and educators with clear documentation on scoring limitations, error rates for neurodivergent or non-native speakers, and human override procedures." },
      { article: "Article 27", title: "Fundamental Rights Impact Assessment (FRIA)", detail: "Public and private educational deployers must complete a FRIA prior to putting the system into use." },
    ],
    exemptionsAndEdgeCases:
      "Remember that inferring student *emotions* in educational institutions is prohibited outright under Article 5(1)(f). Purely formative study aids or grammar checkers that do not steer institutional assessment remain Minimal/Limited risk.",
  },
  {
    slug: "employment-workers-management",
    section: "annex-iii",
    articleRef: "Annex III Point 4",
    title: "Employment, HR Tech, Recruitment Screening & Worker Management",
    riskTier: "High",
    enforcementDeadline: "2 August 2026",
    maxPenalty: "Up to €15,000,000 or 3% of worldwide annual turnover",
    summary:
      "Annex III Point 4 classifies as High-Risk all AI systems intended for recruitment or selection of natural persons (targeted job ads, CV/resume screening, candidate evaluation) and systems making decisions affecting work terms, promotions, terminations, task allocation, or performance monitoring.",
    statutoryScope:
      "Applies to any HR SaaS, Applicant Tracking System (ATS) ranker, AI interviewer, or algorithmic workforce management tool marketed or deployed in the European Union.",
    technicalExamples: [
      "AI resume screening SaaS that parses, scores, or ranks job applicants against job descriptions.",
      "Automated video or chat interview evaluation platforms.",
      "Gig-economy or warehouse algorithmic task-allocation and productivity scoring software.",
    ],
    obligations: [
      { article: "Article 9, 10 & 11", title: "Anti-Discrimination Data Governance & Annex IV Technical Dossier", detail: "Document training/validation datasets, test for gender/age/disability bias, and maintain an Annex IV technical file." },
      { article: "Article 14 & 26(7)", title: "Human Oversight & Mandatory Worker Notification", detail: "Ensure human recruiters review candidate rankings, and employers inform workers' representatives and affected employees before deploying High-Risk workplace AI." },
      { article: "Article 49", title: "EU High-Risk AI Database Registration", detail: "Register the HR AI system in the European Commission database prior to market placement." },
    ],
    exemptionsAndEdgeCases:
      "Under Article 6(3), purely preparatory administrative tools (such as formatting a calendar invite or keyword search without ranking candidates) may claim a documented exemption if they do not materially influence hiring decisions—and never when profiling natural persons.",
  },
  {
    slug: "essential-private-public-services",
    section: "annex-iii",
    articleRef: "Annex III Point 5",
    title: "Essential Services: Credit Scoring, Health/Life Insurance & Emergency Dispatch",
    riskTier: "High",
    enforcementDeadline: "2 August 2026",
    maxPenalty: "Up to €15,000,000 or 3% of worldwide annual turnover",
    summary:
      "Annex III Point 5 designates as High-Risk AI systems evaluating public benefit eligibility, assessing creditworthiness or credit scores of natural persons, pricing/underwriting life and health insurance, or prioritizing emergency 112/medical/fire/police calls.",
    statutoryScope:
      "Regulates FinTech, InsurTech, GovTech, and emergency triage software whose outputs gate access to essential livelihood, healthcare, financial credit, or emergency rescue.",
    technicalExamples: [
      "Consumer credit scoring and BNPL (Buy Now, Pay Later) underwriting models.",
      "Life and health insurance actuarial risk-scoring and automated premium pricing AI.",
      "Public welfare benefits eligibility and clawback detection systems.",
      "112 emergency call triage and ambulance dispatch prioritization engines.",
    ],
    obligations: [
      { article: "Article 13 & 86", title: "Right to Explanation for Individual Decision-Making", detail: "Affected persons have a statutory right under Article 86 to obtain a clear and meaningful explanation of the role of the AI system in the decision-making procedure." },
      { article: "Article 27", title: "Mandatory Fundamental Rights Impact Assessment (FRIA)", detail: "Banking, insurance, and public authority deployers must perform a FRIA before first use." },
    ],
    exemptionsAndEdgeCases:
      "AI systems used exclusively for detecting financial fraud (e.g., payment card anti-fraud rules) are explicitly carved out from the Annex III Point 5(b) credit-scoring classification.",
  },
  {
    slug: "law-enforcement",
    section: "annex-iii",
    articleRef: "Annex III Point 6",
    title: "Law Enforcement: Evidence Evaluation, Victim Risk & Criminal Profiling",
    riskTier: "High",
    enforcementDeadline: "2 August 2026",
    maxPenalty: "Up to €15,000,000 or 3% of worldwide annual turnover",
    summary:
      "Annex III Point 6 covers AI systems used by or on behalf of law enforcement authorities to assess victim risk, operate polygraphs, evaluate evidence reliability, assess offending/re-offending risk grounded in objective facts, or profile persons during criminal investigations.",
    statutoryScope:
      "Applies to forensic, investigative, and policing software supplied to EU law enforcement agencies.",
    technicalExamples: [
      "Domestic violence victim risk-assessment tools used by police departments.",
      "Digital forensics tools evaluating the authenticity or reliability of audio/video evidence.",
    ],
    obligations: [
      { article: "Article 9–15 & 49", title: "Strict Audit Logging, Human Oversight & Secure Registration", detail: "Law enforcement high-risk systems are registered in a secure non-public section of the EU database under Article 49(4)." },
    ],
    exemptionsAndEdgeCases:
      "If criminal risk prediction is based *solely* on personality profiling without objective facts linked to a crime, it is banned outright under Article 5(1)(d).",
  },
  {
    slug: "migration-asylum-border-control",
    section: "annex-iii",
    articleRef: "Annex III Point 7",
    title: "Migration, Asylum & Border Control Management",
    riskTier: "High",
    enforcementDeadline: "2 August 2026",
    maxPenalty: "Up to €15,000,000 or 3% of worldwide annual turnover",
    summary:
      "Annex III Point 7 covers AI systems used by competent public authorities in migration, asylum, and border control for polygraphs, security/health/irregular migration risk assessment, travel document authenticity verification, and examining asylum/visa/residence applications.",
    statutoryScope:
      "Applies to border e-gate document scanners, visa triage assistants, and asylum case-assessment software.",
    technicalExamples: [
      "Automated passport and travel document forgery detection scanners at border checkpoints.",
      "AI case-triage systems assisting migration officers in processing visa or residence applications.",
    ],
    obligations: [
      { article: "Article 10, 14 & 27", title: "Fundamental Rights Safeguards & Human Case-Officer Finality", detail: "Automated outputs must never replace individualized human examination of asylum or visa claims." },
    ],
    exemptionsAndEdgeCases:
      "Commercial travel booking or private corporate identity document checks outside public migration/border authority functions are evaluated under Annex III Point 1 (Biometrics) rather than Point 7.",
  },
  {
    slug: "administration-of-justice-democracy",
    section: "annex-iii",
    articleRef: "Annex III Point 8",
    title: "Administration of Justice & Democratic Processes",
    riskTier: "High",
    enforcementDeadline: "2 August 2026",
    maxPenalty: "Up to €15,000,000 or 3% of worldwide annual turnover",
    summary:
      "Annex III Point 8 classifies as High-Risk AI systems intended to be used by a judicial authority (or on their behalf) to assist in researching and interpreting facts and the law and in applying the law to a concrete set of facts, as well as AI systems intended to influence the outcome of an election or referendum or voting behavior.",
    statutoryScope:
      "Covers judicial decision-support software, ODR/ADR tribunal systems, and algorithmic political campaign micro-targeting tools.",
    technicalExamples: [
      "Judicial legal-research and sentencing-support AI deployed by courts or arbitral tribunals.",
      "Political campaign AI engines designed to micro-target and steer voter behavior in EU elections.",
    ],
    obligations: [
      { article: "Article 11, 13 & 14", title: "Judicial Independence & Verifiable Citation Provenance", detail: "Ensure complete auditability of legal citations and prevent hallucinated case law in judicial workflows." },
    ],
    exemptionsAndEdgeCases:
      "Purely administrative court back-office tasks (docketing, anonymization of published judgments, or transcription without legal interpretation) are excluded from Annex III Point 8(a). Political campaign organization tools that natural persons are not directly exposed to (e.g., logistics scheduling) are excluded from Point 8(b).",
  },
];

export const ANNEX_I_AREAS: AiActGuidePage[] = [
  {
    slug: "machinery-robotics",
    section: "annex-i",
    articleRef: "Article 6(1) & Annex I Section A (Point 1)",
    title: "AI Safety Components in Machinery & Industrial Robotics",
    riskTier: "High",
    enforcementDeadline: "2 August 2027",
    maxPenalty: "Up to €15,000,000 or 3% of worldwide annual turnover",
    summary:
      "Under Article 6(1) and Annex I, an AI system that is a safety component of machinery covered by the EU Machinery Directive 2006/42/EC / Machinery Regulation (EU) 2023/1230—and required to undergo third-party conformity assessment—is classified as a High-Risk AI system.",
    statutoryScope:
      "Bridges physical CE product compliance and EU AI Act obligations for collaborative robots (cobots), autonomous mobile robots (AMRs), and industrial machinery using AI vision or control loops for safety functions.",
    technicalExamples: [
      "Computer-vision collision avoidance on warehouse autonomous forklifts.",
      "Adaptive force-limiting AI controllers on collaborative assembly arms.",
    ],
    obligations: [
      { article: "Article 6(1) & Art. 43(3)", title: "Unified CE + AI Act Conformity Assessment", detail: "Integrate EU AI Act Chapter III Section 2 requirements directly into the existing Machinery Regulation Notified Body conformity assessment and single EU Declaration of Conformity." },
    ],
    exemptionsAndEdgeCases:
      "If the AI module only optimizes energy consumption or throughput while a deterministic hardware PLC handles all safety-rated emergency stops, the AI module may not constitute a 'safety component' under Article 3(14).",
  },
  {
    slug: "toys-child-products",
    section: "annex-i",
    articleRef: "Article 6(1) & Annex I Section A (Point 2)",
    title: "AI-Enabled Toys & Connected Child Monitors (Toy Safety Directive)",
    riskTier: "High",
    enforcementDeadline: "2 August 2027",
    maxPenalty: "Up to €15,000,000 or 3% of worldwide annual turnover",
    summary:
      "Connected toys, interactive dolls, and smart nursery devices governed by Directive 2009/48/EC (Toy Safety) or Radio Equipment Directive 2014/53/EU face overlapping EU AI Act Annex I/III and Article 5(1)(b) child-protection rules.",
    statutoryScope:
      "Applies to physical children's products incorporating voice assistants, camera recognition, or adaptive behavioral AI.",
    technicalExamples: [
      "Interactive conversational plush toys with embedded LLM voice modules.",
      "Smart baby monitors with facial recognition, sleep posture tracking, or cry-emotion classification.",
    ],
    obligations: [
      { article: "Annex I & III + RED 2014/53/EU", title: "CE Technical File + Biometric/Child Safety Controls", detail: "Comply with EN 71 physical/chemical toy safety, RED cybersecurity (Art. 3(3)(d)/(e)/(f)), and EU AI Act High-Risk data governance." },
    ],
    exemptionsAndEdgeCases:
      "Any AI feature in a toy that exploits a child's age vulnerability to distort behavior and cause harm is strictly banned under Article 5(1)(b) (already in force since 2 February 2025).",
  },
  {
    slug: "medical-devices-mdr",
    section: "annex-i",
    articleRef: "Article 6(1) & Annex I Section A (Point 11)",
    title: "AI in Medical Devices (MDR Regulation (EU) 2017/745)",
    riskTier: "High",
    enforcementDeadline: "2 August 2027",
    maxPenalty: "Up to €15,000,000 or 3% of worldwide annual turnover",
    summary:
      "Software as a Medical Device (SaMD) and hardware medical devices incorporating AI that require a Notified Body conformity assessment (Class IIa, IIb, and III under MDR (EU) 2017/745) are High-Risk AI systems under Article 6(1) and Annex I.",
    statutoryScope:
      "Covers radiology triage AI, diagnostic imaging hardware, patient monitoring wearables with clinical claims, and surgical robotics.",
    technicalExamples: [
      "AI-assisted CT/MRI lesion detection software (Class IIa/IIb SaMD).",
      "Smart wearable ECG/arrhythmia diagnostic patch with cloud AI classification.",
    ],
    obligations: [
      { article: "Article 8 & 43(3)", title: "Single Notified Body Audit (MDR + AI Act)", detail: "Combine the EU AI Act quality management system (Article 17) with ISO 13485 / MDR Annex IX technical documentation." },
    ],
    exemptionsAndEdgeCases:
      "Class I medical devices that are self-certified without Notified Body involvement under MDR are not triggered by Article 6(1), unless they separately match an Annex III category.",
  },
  {
    slug: "in-vitro-diagnostics-ivdr",
    section: "annex-i",
    articleRef: "Article 6(1) & Annex I Section A (Point 12)",
    title: "AI in In Vitro Diagnostic Medical Devices (IVDR (EU) 2017/746)",
    riskTier: "High",
    enforcementDeadline: "2 August 2027",
    maxPenalty: "Up to €15,000,000 or 3% of worldwide annual turnover",
    summary:
      "AI systems embedded in or constituting Class B, C, or D in vitro diagnostic devices under Regulation (EU) 2017/746 (IVDR) requiring Notified Body conformity assessment are High-Risk under Annex I.",
    statutoryScope:
      "Applies to digital pathology slide scanners, genomic variant pathogenicity classifiers with clinical diagnostic intended purpose, and automated blood analyzer software.",
    technicalExamples: [
      "Automated digital pathology cancer grading algorithms.",
      "Infectious disease assay interpretation software.",
    ],
    obligations: [
      { article: "Article 10 & IVDR Annex XIII", title: "Clinical Performance & Dataset Representativeness", detail: "Validate sensitivity/specificity across diverse EU patient cohorts and maintain post-market performance follow-up." },
    ],
    exemptionsAndEdgeCases:
      "Research-Use-Only (RUO) bioinformatics tools with no clinical diagnostic intended purpose are exempt under Article 2(6)/(8) scientific R&D exclusions.",
  },
  {
    slug: "radio-equipment-iot",
    section: "annex-i",
    articleRef: "Article 6(1) & Annex I Section A (Point 9)",
    title: "Connected Hardware, Smart Cameras & Radio Equipment (RED 2014/53/EU)",
    riskTier: "High",
    enforcementDeadline: "2 August 2027",
    maxPenalty: "Up to €15,000,000 or 3% of worldwide annual turnover",
    summary:
      "Wireless and IoT devices covered by Radio Equipment Directive (RED) 2014/53/EU and the Cyber Resilience Act (EU) 2024/2847 face dual hardware-safety and AI governance obligations when embedding edge AI or biometric sensors.",
    statutoryScope:
      "Covers Wi-Fi/Bluetooth smart cameras, smart doorbells, connected wearables, and industrial wireless sensors.",
    technicalExamples: [
      "Wi-Fi smart baby monitors and home security cameras with edge facial or cry recognition.",
      "Bluetooth biometric access-control smart locks.",
    ],
    obligations: [
      { article: "RED Art. 3(3) & CRA + AI Act", title: "Radio Spectrum, Cybersecurity & AI Transparency", detail: "Ensure EN 18031 RED cybersecurity compliance, CE marking, EU Responsible Person labeling, and AI Act risk controls." },
    ],
    exemptionsAndEdgeCases:
      "Connected devices without AI or biometric recognition still require CE marking (RED/LVD/EMC/RoHS) and GPSR traceability, even when EU AI Act obligations are Minimal.",
  },
  {
    slug: "civil-aviation-automotive",
    section: "annex-i",
    articleRef: "Article 6(1) & Annex I Section B",
    title: "Civil Aviation, Drones & Motor Vehicle Type-Approval AI",
    riskTier: "High",
    enforcementDeadline: "2 August 2027",
    maxPenalty: "Up to €15,000,000 or 3% of worldwide annual turnover",
    summary:
      "Annex I Section B covers high-risk AI safety components in civil aviation (EASA Regulation (EU) 2018/1139), unmanned aircraft/drones, railways, marine equipment, and motor vehicles (Regulation (EU) 2018/858).",
    statutoryScope:
      "In Section B sectors, the European Commission incorporates EU AI Act safety requirements directly into the sector-specific type-approval implementing acts rather than applying standalone Chapter III routes.",
    technicalExamples: [
      "Autonomous obstacle-avoidance flight controllers on commercial survey drones (HS 8806).",
      "Automotive ADAS lane-keeping and pedestrian emergency braking vision systems.",
    ],
    obligations: [
      { article: "Article 2(2) & Annex I Sec. B", title: "Sectoral Type-Approval Alignment", detail: "Demonstrate AI safety, robustness, and human-in-the-loop override within EASA or UNECE/EU vehicle type-approval dossiers." },
    ],
    exemptionsAndEdgeCases:
      "In-cabin infotainment chatbots that have zero connection to vehicle steering, braking, or safety telemetry are evaluated only under Article 50(1) transparency rules.",
  },
];

export function getAllAiActPages(): AiActGuidePage[] {
  return [...ARTICLE_5_PRACTICES, ...ANNEX_III_CATEGORIES, ...ANNEX_I_AREAS];
}

export function getAiActPage(section: string, slug: string): AiActGuidePage | null {
  return (
    getAllAiActPages().find((p) => p.section === section && p.slug === slug) ?? null
  );
}
