import { GoogleGenAI } from "@google/genai";
import type { Pool } from "pg";
import { getDbPool } from "./db";
import { searchHsCorpusLocal } from "@/data/hs-taxonomy";

export type ClassificationTier = "high" | "medium" | "low";

export interface TierThresholds {
  confidenceFloor: number;
  highConfidenceMargin: number;
}

export interface HsRetrievedCandidate {
  hs_code: string;
  description: string;
  score: number;
}

export interface HsRetrievalResult {
  tier: ClassificationTier;
  review_recommended: boolean;
  candidates: HsRetrievedCandidate[];
  source: "pgvector" | "local_corpus";
}

/**
 * Confidence Math & Tier Assignment ported from ai-customs-code-classifier/lib/classify.ts
 */
export function calculateTier(
  scores: number[],
  thresholds: TierThresholds = {
    confidenceFloor: parseFloat(process.env.CONFIDENCE_FLOOR || "0.60"),
    highConfidenceMargin: parseFloat(process.env.HIGH_CONFIDENCE_MARGIN || "0.15"),
  }
): ClassificationTier {
  if (scores.length === 0) {
    return "low";
  }
  const top = scores[0];
  const margin = scores.length === 1 ? Infinity : scores[0] - scores[1];

  if (top < thresholds.confidenceFloor) {
    return "low";
  } else if (margin >= thresholds.highConfidenceMargin) {
    return "high";
  } else {
    return "medium";
  }
}

export function filterCandidates(
  tier: ClassificationTier,
  results: HsRetrievedCandidate[],
  config: { minScore: number; maxMedium: number } = {
    minScore: parseFloat(process.env.CANDIDATE_MIN_SCORE || "0.60"),
    maxMedium: parseInt(process.env.MAX_MEDIUM_CANDIDATES || "3", 10),
  }
): HsRetrievedCandidate[] {
  if (tier === "high") {
    return results.length > 0 ? [results[0]] : [];
  }
  if (tier === "medium") {
    return [...results]
      .filter((r) => r.score >= config.minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, config.maxMedium);
  }
  return results.slice(0, 1);
}

/**
 * Step B: Retrieve top-K 6-digit HS candidates via pgvector (`text-embedding-004`) with graceful fallback
 * to the bundled 5,756-code WCO/USITC corpus when running in mock/offline/test mode.
 */
export async function retrieveHsCandidates(
  queryText: string,
  options?: {
    pool?: Pool | null;
    topK?: number;
    generateEmbedding?: (text: string) => Promise<number[]>;
    forceLocal?: boolean;
  }
): Promise<HsRetrievalResult> {
  const topK = options?.topK ?? parseInt(process.env.RETRIEVAL_TOP_K || "5", 10);
  const thresholds: TierThresholds = {
    confidenceFloor: parseFloat(process.env.CONFIDENCE_FLOOR || "0.60"),
    highConfidenceMargin: parseFloat(process.env.HIGH_CONFIDENCE_MARGIN || "0.15"),
  };

  const isMock =
    options?.forceLocal ||
    process.env.MOCK_GEMINI === "true" ||
    process.env.NODE_ENV === "test" ||
    !process.env.GEMINI_API_KEY;

  const pool = options?.pool !== undefined ? options.pool : getDbPool();

  if (!isMock && pool) {
    try {
      let embeddingValues: number[];
      if (options?.generateEmbedding) {
        embeddingValues = await options.generateEmbedding(queryText);
      } else {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        const embeddingModel = process.env.EMBEDDING_MODEL || "text-embedding-004";
        try {
          const res = await ai.models.embedContent({
            model: embeddingModel,
            contents: queryText,
            config: { outputDimensionality: 768 },
          });
          embeddingValues = res.embeddings?.[0]?.values || [];
        } catch {
          const fallbackRes = await ai.models.embedContent({
            model: "gemini-embedding-001",
            contents: queryText,
            config: { outputDimensionality: 768 },
          });
          embeddingValues = fallbackRes.embeddings?.[0]?.values || [];
        }
      }

      if (embeddingValues.length === 768) {
        const vectorStr = `[${embeddingValues.join(",")}]`;
        const sql = `SELECT hs_code, description, 1 - (embedding <=> $1::vector) AS score FROM hs_corpus ORDER BY embedding <=> $1::vector LIMIT $2`;
        const dbRes = await pool.query(sql, [vectorStr, topK]);
        if (dbRes.rows.length > 0) {
          const rawCandidates: HsRetrievedCandidate[] = dbRes.rows.map((r) => ({
            hs_code: String(r.hs_code),
            description: String(r.description),
            score: Number(parseFloat(r.score).toFixed(4)),
          }));
          const scores = rawCandidates.map((c) => c.score);
          const tier = calculateTier(scores, thresholds);
          return {
            tier,
            review_recommended: tier !== "high",
            candidates: rawCandidates,
            source: "pgvector",
          };
        }
      }
    } catch {
      // Fall through to local 5,756-code corpus search if DB or embedding service is unreachable
    }
  }

  const localCandidates = searchHsCorpusLocal(queryText, topK);
  const scores = localCandidates.map((c) => c.score);
  const tier = calculateTier(scores, thresholds);

  return {
    tier,
    review_recommended: tier !== "high",
    candidates: localCandidates,
    source: "local_corpus",
  };
}
