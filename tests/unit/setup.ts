import { beforeAll, afterEach, vi } from "vitest";

beforeAll(() => {
  process.env.MOCK_GEMINI = "true";
  process.env.VERIFIED_DATE = "2026-10-01";
  process.env.NEXT_PUBLIC_VERIFIED_DATE = "2026-10-01";
});

afterEach(() => {
  vi.clearAllMocks();
});
