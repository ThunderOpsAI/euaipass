# HANDOFF: EUPass V1

**Product**: EUPass — Unified European Market Entry & Regulatory Screener  
**Repository**: `/Users/thunderopsai/Documents/Workspace/01_Projects/eupass`  
**Target Environment**: Next.js 16 App Router, TypeScript, Tailwind CSS, Vercel  
**Primary Question Answered**: *"Can I sell or ship this product into the EU, and what do I need to do?"*  
**Business Model**: Free, ad-supported (Google AdSense via dynamic `AdSlot` with EU Consent Mode v2 gating) + contextual affiliate/partner links in the compliance checklist.

---

## 1. What Was Built (File Map)

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
│   │   ├── ad-slot.tsx                    # AdSense slot component (renders null if env unset, reserved height for CLS < 0.1)
│   │   ├── consent-banner.tsx             # Google-certified CMP / Consent Mode v2 banner (ad_storage, ad_personalization)
│   │   ├── disclaimer.tsx                 # Non-legal advice disclaimer with NEXT_PUBLIC_VERIFIED_DATE
│   │   ├── navigation.tsx                 # Top navigation bar with quick links to all 3 pillars
│   │   ├── scanner-form.tsx               # Unified intake form (10–1,000 chars, optional image ≤5MB, in-memory)
│   │   └── result-view.tsx                # Dynamic pillar cards, copyable commercial invoice snippet, interactive checklist
│   ├── config/
│   │   └── partners.ts                    # Partner and affiliate link registry labeled "Partner"
│   ├── data/
│   │   ├── hs-corpus.json                 # 5,756 6-digit HS codes and 1,139 headings
│   │   ├── hs-taxonomy.ts                 # HS taxonomy lookup, chapters, headings, and fallback vector/keyword scoring
│   │   ├── ai-act-data.ts                 # Full database of Article 5 prohibitions, Annex III high-risk domains, Annex I CE areas
│   │   └── product-safety-data.ts         # 6 in-depth guides for GPSR, CE, DPP, and EU customs rules
│   └── lib/
│       ├── consent.tsx                    # Google Consent Mode v2 React Context and localStorage sync
│       ├── db.ts                          # Optional pgvector database pool connection
│       ├── hs-rag.ts                      # Step B: HS candidate retrieval, cosine similarity/scoring, confidence tiers
│       ├── rate-limit.ts                  # Per-IP sliding rate limiter (10/hr), global daily cap, Cloudflare Turnstile bot check
│       ├── router.ts                      # Step A: Intake classification (physical | digital | physical_with_ai, has_ai)
│       ├── scanner.ts                     # Step C: Single Gemini LLM call orchestrator with responseSchema and mock fallback
│       ├── schema.ts                      # Zod validation schema and Gemini JSON schema definition
│       └── pdf/
│           ├── generator.ts               # Server-side @react-pdf/renderer stream to buffer generator
│           └── report-document.tsx        # Branded PDF document component matching eu-ai-act-compliance-checker layout
├── tests/
│   ├── unit/
│   │   ├── ad-slot.test.tsx               # Verifies AdSlot renders null without env var, renders when set
│   │   ├── pillar-rendering.test.tsx      # Verifies conditional rendering of Customs, AI Act, and Safety pillars
│   │   ├── rate-limit.test.ts             # Verifies sliding rate limit and global daily cap enforcement
│   │   ├── router.test.ts                 # Verifies Step A classification on physical, digital, and hybrid products
│   │   ├── schema.test.ts                 # Verifies Gemini output validation and JSON schema structure
│   │   └── sitemap.test.ts                # Verifies sitemap includes HS codes, AI Act slugs, and legal routes
│   └── e2e/
│       └── eupass-flow.spec.ts            # Playwright E2E: scan -> pillar cards -> checklist localStorage -> PDF export
├── .env.example                           # Documented configuration template
├── .env.local                             # Local development environment configuration
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── vitest.config.ts
└── playwright.config.ts
```

---

## 2. How to Run & Environment Variables

### Installation & Development
```bash
cd /Users/thunderopsai/Documents/Workspace/01_Projects/eupass
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building & Production Serving
```bash
npm run build
npm start
```

### Running Tests
```bash
npm run lint         # ESLint validation (0 errors, 0 warnings)
npm run typecheck    # TypeScript compiler check (0 errors)
npm test             # Vitest unit test suite (6 files, 13 tests)
npx playwright test  # Playwright E2E flow test (headless chromium)
```

### Environment Variables (`.env.example` / `.env.local`)
| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini API key for unified LLM classification | Copied from source repo |
| `GEMINI_MODEL` | Gemini model to use for single-pass structured output | `gemini-2.5-flash` |
| `NEXT_PUBLIC_APP_URL` | Canonical origin for metadata, sitemaps, and robots | `http://localhost:3000` |
| `NEXT_PUBLIC_VERIFIED_DATE` | Regulatory verification timestamp displayed in disclaimers and PDF | `October 2026` |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Google AdSense publisher ID (leave blank to hide ad slots) | `ca-pub-XXXXXXXXXXXXXXXX` |
| `DAILY_SCAN_CAP` | Global daily quota cap for `/api/scan` endpoint | `500` |
| `RATE_LIMIT_PER_HOUR` | Per-IP sliding rate limit for `/api/scan` endpoint | `10` |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key (bot check bypassed if unset) | Optional |
| `DATABASE_URL` | Optional PostgreSQL / pgvector connection string for embedding RAG | Optional (corpus fallback included) |

---

## 3. Test, Build, and Lighthouse Results

### A. TypeScript Typecheck
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
Test Files  6 passed (6)
Tests       13 passed (13)
Duration    4.70s

✓ tests/unit/router.test.ts (3 tests)
✓ tests/unit/rate-limit.test.ts (2 tests)
✓ tests/unit/ad-slot.test.tsx (2 tests)
✓ tests/unit/pillar-rendering.test.tsx (2 tests)
✓ tests/unit/sitemap.test.ts (1 test)
✓ tests/unit/schema.test.ts (3 tests)
```

### D. Playwright E2E Test
```
Running 1 test using 1 worker
✓ tests/e2e/eupass-flow.spec.ts:4:7 › EUPass End-to-End Scan Flow › scan product -> verify cards -> test checklist persistence -> trigger PDF export (6.1s)

1 passed (10.9s)
```

### E. Next.js Production Build Output
```
▲ Next.js 16.3.4 (Turbopack)
✓ Running next.config.ts took 2.6s
✓ Compiled successfully in 13.1s
✓ Generating static pages using 9 workers (139/139) in 2.6s

Total Static Pages Generated: 139 pages
- Core & Legal Pages: 6 (/ , /about, /contact, /privacy, /terms, /_not-found)
- HS Taxonomy Hub: 97 (/hs + 96 individual chapter hubs /hs/01 - /hs/99)
- Dynamic HS Headings & 6-digit Codes: /hs/[chapter]/[heading] & /hs/code/[code] (ISR on-demand, 86,400s cache)
- EU AI Act Matrix: 23 static pages (/eu-ai-act + 8 Article 5 + 8 Annex III + 6 Annex I)
- Product Safety & GPSR Hub: 7 static pages (/product-safety + 6 comprehensive guides)
- Dynamic Feeds: 3 (/ads.txt, /robots.txt, /sitemap.xml)
- API Routes: 2 (/api/scan, /api/pdf)
```

### F. Lighthouse Audit on HS Code Page (`/hs/code/6109.10`)
```
SEO Score:         100 / 100
Cumulative Layout Shift (CLS): 0.000 (Passes requirement CLS < 0.1)
Performance Score: 91 / 100
```

---

## 4. Verification Against Acceptance Criteria

1. **Clean Codebase & Untouched Source Repos**:
   - `/Users/thunderopsai/Documents/Workspace/01_Projects/eupass` is a fully isolated Next.js 16 project.
   - `eu-ai-act-compliance-checker` has 0 git diffs.
   - `ai-customs-code-classifier` remains untouched (no modifications made during this task).
2. **Quality Gates**:
   - `npm run lint` -> PASSED (0 errors, 0 warnings).
   - `npm run typecheck` -> PASSED (0 errors).
   - `npm test` -> PASSED (13 unit tests).
   - `npm run build` -> PASSED (139 SSG pages + on-demand ISR).
   - `npx playwright test` -> PASSED.
3. **Pillar Routing Verification**:
   - `"100% cotton t-shirt"` -> Classifies as `physical`, outputs Customs HS + Product Safety pillars only (no AI Act).
   - `"AI resume screening SaaS"` -> Classifies as `digital` with AI, outputs EU AI Act pillar only (Annex III High Risk, Employment).
   - `"smart baby monitor with face recognition"` -> Classifies as `physical_with_ai`, outputs all three pillars (Customs HS, EU AI Act, Product Safety / CE).
4. **Clean Dependencies & Privacy**:
   - Zero Stripe, Resend, or Supabase Auth dependencies or paywall UI.
   - Zero persistence of raw user queries or photos: user data is analyzed strictly in-memory and returned to the browser.
5. **Programmatic SEO & Monetization**:
   - 96 HS chapter static hubs + 6-digit code ISR routes with JSON-LD schema, breadcrumbs, and embedded scanners.
   - 22 EU AI Act risk pages (Article 5, Annex III, Annex I) and 6 Product Safety guides.
   - `<AdSlot />` strictly renders `null` when `NEXT_PUBLIC_ADSENSE_CLIENT` is unset.
   - Ads are gated by EU Consent Mode v2 (`ad_storage` consent).
   - Commercial invoice snippet is copyable to clipboard with one click.
   - Checklist state persists in `localStorage` without login.
   - Dynamic `ads.txt` and `sitemap.xml` with canonical links.
6. **Abuse & Cost Controls**:
   - Sliding 1-hour window per-IP rate limiter (default 10 requests/hour).
   - Global daily quota cap (default 500 requests/day).
   - Friendly 429 response when limits are exceeded.
7. **Statutory Compliance**:
   - Non-legal advice disclaimers rendered prominently on results page and embedded in PDF export.
   - Regulatory verification date sourced dynamically from `NEXT_PUBLIC_VERIFIED_DATE`.

---

## 5. Known Gaps & Deviations
- **TARIC 8–10-Digit Duty Calculator**: Intentionally excluded as per the prompt specification (focus is on 6-digit WCO Harmonized System codes for international commercial invoice compliance).
- **Turnstile Bot Check**: Fully implemented in `src/lib/rate-limit.ts`; if `TURNSTILE_SECRET_KEY` is omitted, the token check gracefully passes to facilitate local development and automated CI testing.

---

## 6. Manual Steps for the Owner

1. **Google AdSense Approval**:
   - Ensure the site is deployed to your custom domain on Vercel with all 4 legal pages (`/about`, `/privacy`, `/terms`, `/contact`) live.
   - Add your AdSense Publisher ID to `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX` in the Vercel dashboard and redeploy.
   - Verify that `https://yourdomain.com/ads.txt` displays `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`.
2. **CMP / Cookie Consent Setup**:
   - If using a third-party Google-certified CMP (e.g. Funding Choices, Cookiebot, or Termly), inject the CMP header script in `src/app/layout.tsx`. The included `ConsentProvider` is already wired to Google Consent Mode v2 primitives (`gtag("consent", "update", ...)`).
3. **Database Population (Optional)**:
   - EUPass includes a high-speed local corpus fallback (`src/data/hs-corpus.json` with 5,756 codes) that runs without any external database.
   - To connect pgvector for high-scale vector RAG, set `DATABASE_URL` in `.env.local` or Vercel and run your corpus ingestion script.
4. **Deploying to Vercel**:
   ```bash
   vercel
   ```
   Configure environment variables (`GEMINI_API_KEY`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_ADSENSE_CLIENT`, `NEXT_PUBLIC_VERIFIED_DATE`) in the Vercel Project Settings.
