# HANDOFF: EUPass V1

**Product**: EUPass — Unified European Market Entry & Regulatory Screener  
**Local Repository**: `/Users/thunderopsai/Documents/Workspace/01_Projects/eupass`  
**GitHub Repository**: [https://github.com/ThunderOpsAI/euaipass](https://github.com/ThunderOpsAI/euaipass)  
**Production Domain**: [https://euaipass.com](https://euaipass.com)  
**Target Environment**: Next.js 16 App Router, TypeScript, Tailwind CSS v4, Vercel  
**Primary Question Answered**: *"Can I sell or ship this product into the EU, and what do I need to do?"*  
**Business Model**: 100% Free, multi-channel ad monetization:
1. **Contextual Display Ads**: Google AdSense banners (`AdSlot`) across 139+ programmatic SEO landing pages with EU Consent Mode v2 gating.
2. **Web Rewarded Video Ads**: MacroDroid-style 10-second sponsor video gate (`RewardedAdModal` via `window.adBreak`) required to unlock and download the certified PDF compliance dossier.
3. **Affiliate & Partner Links**: Contextual partner CTAs (EU Responsible Person, IOSS registration, CE testing labs) embedded into statutory checklists.

---

## 1. Architecture & File Map

```
/Users/thunderopsai/Documents/Workspace/01_Projects/eupass
├── src/
│   ├── app/
│   │   ├── layout.tsx                     # Root layout with ConsentProvider, AdSense scripts, Navigation, Disclaimer
│   │   ├── globals.css                    # Tailwind CSS v4 styling & dark mode support
│   │   ├── page.tsx                       # Landing page with unified scanner form, value prop, and results view
│   │   ├── sitemap.ts                     # Dynamic sitemap generator (/hs, /eu-ai-act, /product-safety, static pages)
│   │   ├── robots.ts                      # robots.txt generator referencing sitemap.xml
│   │   ├── ads.txt/route.ts               # Dynamic ads.txt route powered by NEXT_PUBLIC_ADSENSE_CLIENT
│   │   ├── api/
│   │   │   ├── scan/route.ts              # In-memory unified scan endpoint (per-IP rate limit + daily global cap)
│   │   │   └── pdf/route.ts               # Free PDF report generation route using @react-pdf/renderer
│   │   ├── hs/
│   │   │   ├── page.tsx                   # HS Tariff Directory index (all 96 WCO chapters)
│   │   │   ├── [chapter]/page.tsx         # Chapter hub (SSG for all 96 chapters)
│   │   │   ├── [chapter]/[heading]/page.tsx # Heading detail (ISR with breadcrumbs and embedded scanner)
│   │   │   └── code/[code]/page.tsx       # 6-digit HS code page (ISR, invoice snippet generator, breadcrumbs, JSON-LD)
│   │   ├── eu-ai-act/
│   │   │   ├── page.tsx                   # AI Act compliance overview (Article 5, Annex III, Annex I)
│   │   │   └── [section]/[slug]/page.tsx  # Static pages for 8 Art. 5 practices, 8 Annex III categories, 6 Annex I areas
│   │   ├── product-safety/
│   │   │   ├── page.tsx                   # GPSR & CE Directives guide index
│   │   │   └── [slug]/page.tsx            # 6 substantive guides (GPSR, EU Responsible Person, CE Marking, DPP, €150 IOSS, CRA)
│   │   ├── about/page.tsx                 # About page (editorial mission & in-memory privacy architecture)
│   │   ├── privacy/page.tsx               # Privacy policy (GDPR, zero-retention input, Google AdSense cookies, Gemini LLM)
│   │   ├── terms/page.tsx                 # Terms of service (statutory disclaimers, no legal advice)
│   │   └── contact/page.tsx               # Contact page (editorial feedback & partnership requests)
│   ├── components/
│   │   ├── ad-slot.tsx                    # AdSense display slot (renders null if env unset, reserved height for CLS < 0.1)
│   │   ├── rewarded-ad-modal.tsx          # Web Rewarded Ad modal gating PDF generation (sponsor countdown + completion callback)
│   │   ├── consent-banner.tsx             # Google-certified CMP / Consent Mode v2 banner (ad_storage, ad_personalization)
│   │   ├── disclaimer.tsx                 # Non-legal advice disclaimer with NEXT_PUBLIC_VERIFIED_DATE
│   │   ├── navigation.tsx                 # Top navigation bar with quick links to all 3 pillars
│   │   ├── scanner-form.tsx               # Unified intake form (10–1,000 chars, optional image ≤5MB, in-memory)
│   │   └── result-view.tsx                # Dynamic pillar cards, copyable commercial invoice snippet, checklist, PDF gate
│   ├── config/
│   │   └── partners.ts                    # Partner and affiliate link registry labeled "Partner"
│   ├── data/
│   │   ├── hs-corpus.json                 # 5,756 6-digit HS codes and 1,139 headings
│   │   ├── hs-taxonomy.ts                 # HS taxonomy lookup, chapters, headings, and fallback vector/keyword scoring
│   │   ├── ai-act-data.ts                 # Full database of Article 5 prohibitions, Annex III high-risk domains, Annex I CE areas
│   │   └── product-safety-data.ts         # 6 in-depth guides for GPSR, CE, DPP, and EU customs rules
│   └── lib/
│       ├── adsense-rewarded.ts            # Google Web Rewarded Ads lifecycle (adBreak, reward callbacks & adblock fallback)
│       ├── consent.tsx                    # Google Consent Mode v2 React Context and localStorage sync
│       ├── db.ts                          # Optional pgvector database pool connection
│       ├── hs-rag.ts                      # Step B: HS candidate retrieval, cosine similarity/scoring, confidence tiers
│       ├── rate-limit.ts                  # Per-IP sliding rate limiter (10/hr), global daily cap, Cloudflare Turnstile bot check
│       ├── router.ts                      # Step A: Intake classification (physical | digital | physical_with_ai, has_ai)
│       ├── scanner.ts                     # Step C: Single Gemini LLM call orchestrator with responseSchema and mock fallback
│       ├── schema.ts                      # Zod validation schema and Gemini JSON schema definition
│       └── pdf/
│           ├── generator.ts               # Server-side @react-pdf/renderer stream to buffer generator
│           └── report-document.tsx        # Branded PDF document component matching institutional audit format
├── tests/
│   ├── unit/
│   │   ├── ad-slot.test.tsx               # Verifies AdSlot renders null without env var, renders when set
│   │   ├── rewarded-ad.test.tsx           # Verifies RewardedAdModal rendering, countdown, and reward callbacks
│   │   ├── pillar-rendering.test.tsx      # Verifies conditional rendering of Customs, AI Act, and Safety pillars
│   │   ├── rate-limit.test.ts             # Verifies sliding rate limit and global daily cap enforcement
│   │   ├── router.test.ts                 # Verifies Step A classification on physical, digital, and hybrid products
│   │   ├── schema.test.ts                 # Verifies Gemini output validation and JSON schema structure
│   │   └── sitemap.test.ts                # Verifies sitemap includes HS codes, AI Act slugs, and legal routes
│   └── e2e/
│       └── eupass-flow.spec.ts            # Playwright E2E: scan -> pillar cards -> checklist localStorage -> PDF export
├── .env.example                           # Documented configuration template
├── .env.local                             # Local development environment configuration
├── package.json                           # Configured with Node >=20.9.0 engine constraint
├── package-lock.json                      # Clean lockfile with repaired rolldown optional bindings
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── vitest.config.ts
└── playwright.config.ts
```

---

## 2. Environment Variables & Runtime

### Environment Configuration (`.env.example` / `.env.local` / Vercel Settings)

| Variable | Description | Production Value |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini API key for structured classification | *(Your Gemini API Key)* |
| `GEMINI_MODEL` | Gemini model for single-pass structured output | `gemini-2.5-flash` |
| `NEXT_PUBLIC_APP_URL` | Canonical origin for metadata, sitemaps, robots, and schema | `https://euaipass.com` |
| `NEXT_PUBLIC_VERIFIED_DATE` | Regulatory verification date displayed in disclaimers & PDF | `November 2026` |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Google AdSense publisher ID (leave blank in dev to hide ads) | `ca-pub-XXXXXXXXXXXXXXXX` |
| `NEXT_PUBLIC_CMP_ENABLED` | Toggles Google Consent Mode v2 banner | `true` |
| `DAILY_SCAN_CAP` | Global daily quota cap for `/api/scan` endpoint | `500` |
| `RATE_LIMIT_PER_HOUR` | Per-IP sliding rate limit for `/api/scan` endpoint | `10` |
| `TURNSTILE_SECRET_KEY` | Optional Cloudflare Turnstile secret key | Optional |
| `DATABASE_URL` | Optional PostgreSQL / pgvector connection string | Optional (local corpus fallback active) |

---

## 3. Test & Build Results

### A. TypeScript Compiler
```
> eupass@1.0.0 typecheck
> tsc --noEmit

(0 errors)
```

### B. ESLint
```
> eupass@1.0.0 lint
> eslint

(0 errors, 0 warnings)
```

### C. Vitest Unit Test Suite
```
Test Files  7 passed (7)
Tests       17 passed (17)
Duration    1.32s

✓ tests/unit/router.test.ts (3 tests)
✓ tests/unit/rate-limit.test.ts (2 tests)
✓ tests/unit/ad-slot.test.tsx (2 tests)
✓ tests/unit/rewarded-ad.test.tsx (4 tests)
✓ tests/unit/pillar-rendering.test.tsx (2 tests)
✓ tests/unit/sitemap.test.ts (1 test)
✓ tests/unit/schema.test.ts (3 tests)
```

### D. Next.js Production Build Output
```
▲ Next.js 16.3.4 (Turbopack)
✓ Compiled successfully in 9.1s
✓ Generating static pages using 9 workers (139/139) in 3.1s

Total Static Pages Generated: 139 pages
- Core & Legal Pages: 6 (/ , /about, /contact, /privacy, /terms, /_not-found)
- HS Taxonomy Hub: 97 (/hs + 96 individual chapter hubs /hs/01 - /hs/99)
- Dynamic HS Headings & 6-digit Codes: /hs/[chapter]/[heading] & /hs/code/[code] (ISR on-demand, 86,400s cache)
- EU AI Act Matrix: 23 static pages (/eu-ai-act + 8 Article 5 + 8 Annex III + 6 Annex I)
- Product Safety & GPSR Hub: 7 static pages (/product-safety + 6 comprehensive guides)
- Dynamic Feeds: 3 (/ads.txt, /robots.txt, /sitemap.xml)
- API Routes: 2 (/api/scan, /api/pdf)
```

### E. Lighthouse Audit on HS Code Page (`/hs/code/6109.10`)
```
SEO Score:                     100 / 100
Cumulative Layout Shift (CLS): 0.000 (Passes requirement CLS < 0.1)
Performance Score:             91 / 100
```

---

## 4. Monetization & Ad Flow

### Display Ads (`AdSlot`)
- Static banner ad units placed strategically on high-traffic SEO pages (`/hs/[chapter]`, `/hs/code/[code]`, `/eu-ai-act/*`, `/product-safety/*`).
- Pre-allocated slot heights (`min-h-[250px]` and `min-h-[90px]`) prevent layout shifts (CLS = 0.000).
- Dynamically gates rendering on `ad_storage` consent under Google Consent Mode v2.

### Web Rewarded Ads (`RewardedAdModal`)
- On-page product scans and results remain **100% free and unblocked**.
- Clicking **"Free PDF Export"** opens the Rewarded Ad modal.
- Invokes Google AdSense Web Rewarded format (`window.adBreak({ type: 'reward' })`).
- User watches a 10-second sponsor message; upon completion callback (`adViewed` / `rewardGranted`), the `/api/pdf` endpoint automatically triggers and downloads the report.
- Includes automatic fallback if ad inventory does not fill or if an ad blocker is detected, ensuring users are never blocked from receiving statutory compliance documents.

---

## 5. Deployment Guide (Vercel)

1. **GitHub Connection:**
   The repository is hosted at `https://github.com/ThunderOpsAI/euaipass`.
2. **Importing into Vercel:**
   - In the Vercel Dashboard, select **Add New Project** → Import `ThunderOpsAI/euaipass`.
   - Framework preset: `Next.js`.
   - Node.js Version: `20.x` or `22.x` (enforced via `package.json` `"engines"` field).
3. **Environment Variables:**
   Add `GEMINI_API_KEY`, `GEMINI_MODEL`, `NEXT_PUBLIC_APP_URL`, and `NEXT_PUBLIC_VERIFIED_DATE`.
4. **Custom Domain:**
   Under **Project Settings → Domains**, add:
   - `euaipass.com`
   - `www.euaipass.com`
5. **Google AdSense Approval:**
   Once the site is live with its legal pages (`/about`, `/privacy`, `/terms`, `/contact`), submit `euaipass.com` in Google AdSense. Once approved:
   - Set `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX` in Vercel.
   - Verify `https://euaipass.com/ads.txt` returns your publisher record.
