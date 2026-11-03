import "dotenv/config";
import fs from "fs";
import path from "path";
import { Pool } from "pg";
import { GoogleGenAI } from "@google/genai";

interface UsitcRawItem {
  htsno?: string;
  indent?: string;
  description?: string;
  superior?: string | null;
  [key: string]: unknown;
}

export interface ParsedHsEntry {
  hs_code: string;
  official_description: string;
}

interface CliOptions {
  limit?: number;
  mock: boolean;
  dryRun: boolean;
  fast: boolean;
  url?: string;
  file?: string;
  noCache: boolean;
}

const PRIMARY_USITC_URL = "https://hts.usitc.gov/reststop/exportHts?release=2024&format=json";
const FALLBACK_USITC_URL =
  "https://hts.usitc.gov/reststop/exportList?from=0101&to=9999&format=JSON&styles=false";
const CACHE_FILE_PATH = path.join(process.cwd(), ".cache", "usitc_hts_export.json");

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {
    mock: false,
    dryRun: false,
    fast: false,
    noCache: false,
  };

  for (const arg of args) {
    if (arg.startsWith("--limit=")) {
      const val = parseInt(arg.split("=")[1], 10);
      if (!isNaN(val) && val > 0) options.limit = val;
    } else if (arg === "--mock") {
      options.mock = true;
    } else if (arg === "--fast" || arg === "--skip-llm-expansion") {
      options.fast = true;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--no-cache") {
      options.noCache = true;
    } else if (arg.startsWith("--url=")) {
      options.url = arg.split("=")[1];
    } else if (arg.startsWith("--file=")) {
      options.file = arg.split("=")[1];
    }
  }

  return options;
}

export function cleanHtml(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function parse6DigitCodes(rawItems: UsitcRawItem[]): ParsedHsEntry[] {
  const ancestorStack: { indent: number; desc: string; htsno: string }[] = [];
  const codeMap = new Map<string, ParsedHsEntry>();

  for (const item of rawItems) {
    const rawHts = (item.htsno || "").trim();
    const indent = parseInt(item.indent || "0", 10);
    const desc = cleanHtml(item.description);

    while (ancestorStack.length > 0 && ancestorStack[ancestorStack.length - 1].indent >= indent) {
      ancestorStack.pop();
    }

    const match = rawHts.match(/^(\d{4})\.(\d{2})/);
    if (match) {
      const code6 = `${match[1]}.${match[2]}`;
      if (!codeMap.has(code6)) {
        const ancestors = ancestorStack.map((a) => a.desc).filter((d) => d && d.length > 0);
        const parts = [...ancestors, desc].filter((p) => p && p.length > 0);
        const combinedDescription = parts.join(" - ");
        codeMap.set(code6, {
          hs_code: code6,
          official_description: combinedDescription || desc || `HS ${code6}`,
        });
      }
    }

    ancestorStack.push({ indent, desc, htsno: rawHts });
  }

  return Array.from(codeMap.values());
}

function mockExpandDescription(hsCode: string, officialDescription: string): string {
  const words = officialDescription
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(
      (w) =>
        w.length > 3 &&
        !["other", "parts", "thereof", "than", "having", "with"].includes(w.toLowerCase())
    )
    .slice(0, 5);
  const keywords = words.length > 0 ? words.join(", ") : "standard commercial product";
  return `${officialDescription}\n\nCommon products and variants: consumer goods, commercial retail products, ${keywords}, material variants for ${hsCode}`;
}

function mockEmbedDescription(seedStr: string): number[] {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  const rand = () => {
    h = Math.imul(h ^ (h >>> 15), h | 1);
    h ^= h + Math.imul(h ^ (h >>> 7), h | 61);
    return ((h ^ (h >>> 14)) >>> 0) / 4294967296;
  };
  const dim = 768;
  const vec = new Float64Array(dim);
  let normSq = 0;
  for (let i = 0; i < dim; i++) {
    const val = (rand() - 0.5) * 2;
    vec[i] = val;
    normSq += val * val;
  }
  const norm = Math.sqrt(normSq) || 1;
  return Array.from(vec, (v) => Number((v / norm).toFixed(6)));
}

async function fetchUsitcDataset(options: CliOptions): Promise<UsitcRawItem[]> {
  if (options.file) {
    return JSON.parse(fs.readFileSync(options.file, "utf-8"));
  }
  if (!options.noCache && fs.existsSync(CACHE_FILE_PATH)) {
    const parsed = JSON.parse(fs.readFileSync(CACHE_FILE_PATH, "utf-8"));
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  }

  const res = await fetch(options.url || PRIMARY_USITC_URL).catch(() => null);
  if (res && res.ok) {
    const data = await res.json();
    if (Array.isArray(data)) return data;
  }

  const fallbackRes = await fetch(FALLBACK_USITC_URL);
  if (!fallbackRes.ok) {
    throw new Error(`Failed to fetch USITC dataset: ${fallbackRes.status}`);
  }
  const data = await fallbackRes.json();
  fs.mkdirSync(path.dirname(CACHE_FILE_PATH), { recursive: true });
  fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(data));
  return data;
}

async function main() {
  const options = parseArgs();
  const apiKey = process.env.GEMINI_API_KEY;
  const useMock = options.mock || !apiKey;
  const ai = !useMock && apiKey ? new GoogleGenAI({ apiKey }) : null;

  const rawItems = await fetchUsitcDataset(options);
  const parsedEntries = parse6DigitCodes(rawItems);
  const entriesToProcess = options.limit ? parsedEntries.slice(0, options.limit) : parsedEntries;

  console.log(`Discovered ${parsedEntries.length} unique 6-digit HS codes. Processing ${entriesToProcess.length}...`);

  let pool: Pool | null = null;
  if (!options.dryRun) {
    const databaseUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error("DATABASE_URL is required when dryRun is false");
    pool = new Pool({ connectionString: databaseUrl });
  }

  for (const entry of entriesToProcess) {
    const expanded =
      useMock || options.fast || !ai
        ? mockExpandDescription(entry.hs_code, entry.official_description)
        : entry.official_description;

    let embedding: number[];
    if (useMock || !ai) {
      embedding = mockEmbedDescription(expanded);
    } else {
      const model = process.env.EMBEDDING_MODEL || "text-embedding-004";
      const embedRes = await ai.models.embedContent({
        model,
        contents: expanded,
        config: { outputDimensionality: 768 },
      });
      embedding = embedRes.embeddings?.[0]?.values || mockEmbedDescription(expanded);
    }

    if (!options.dryRun && pool) {
      await pool.query(
        `INSERT INTO hs_corpus (hs_code, description, embedding)
         VALUES ($1, $2, $3)
         ON CONFLICT (hs_code) DO UPDATE
         SET description = EXCLUDED.description,
             embedding = EXCLUDED.embedding`,
        [entry.hs_code, expanded, `[${embedding.join(",")}]`]
      );
    }
  }

  if (pool) await pool.end();
  console.log("Corpus load complete.");
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
