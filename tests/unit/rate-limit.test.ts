import { describe, it, expect, beforeEach } from "vitest";
import { checkScanRateLimit, resetRateLimiter } from "@/lib/rate-limit";

describe("Rate Limiter & Daily Cap", () => {
  beforeEach(() => {
    resetRateLimiter();
  });

  it("enforces per-IP hourly limit", () => {
    const ip = "192.168.1.10";
    const perHourLimit = 3;
    const now = Date.now();

    for (let i = 0; i < perHourLimit; i++) {
      const res = checkScanRateLimit(ip, now, { perHour: perHourLimit, dailyCap: 100 });
      expect(res.allowed).toBe(true);
    }

    const blocked = checkScanRateLimit(ip, now, { perHour: perHourLimit, dailyCap: 100 });
    expect(blocked.allowed).toBe(false);
    expect(blocked.reason).toBe("RATE_LIMIT_EXCEEDED");
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("enforces global daily cap", () => {
    const dailyCap = 2;
    const now = Date.now();

    const r1 = checkScanRateLimit("10.0.0.1", now, { perHour: 10, dailyCap });
    expect(r1.allowed).toBe(true);

    const r2 = checkScanRateLimit("10.0.0.2", now, { perHour: 10, dailyCap });
    expect(r2.allowed).toBe(true);

    const r3 = checkScanRateLimit("10.0.0.3", now, { perHour: 10, dailyCap });
    expect(r3.allowed).toBe(false);
    expect(r3.reason).toBe("DAILY_CAP_REACHED");
  });
});
