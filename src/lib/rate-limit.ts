export interface RateLimitCheckResult {
  allowed: boolean;
  reason?: "RATE_LIMIT_EXCEEDED" | "DAILY_CAP_REACHED";
  retryAfter?: number;
  remainingIp?: number;
  remainingDaily?: number;
  message?: string;
}

interface IpBucket {
  timestamps: number[];
}

const ipMap = new Map<string, IpBucket>();
let dailyDayKey = "";
let dailyCount = 0;

function getUtcDayKey(nowMs: number): string {
  return new Date(nowMs).toISOString().slice(0, 10);
}

export function getRateLimitConfig() {
  const perHour = parseInt(process.env.RATE_LIMIT_PER_HOUR || "10", 10);
  const dailyCap = parseInt(process.env.GLOBAL_DAILY_SCAN_CAP || "500", 10);
  return {
    perHour: Number.isFinite(perHour) && perHour > 0 ? perHour : 10,
    dailyCap: Number.isFinite(dailyCap) && dailyCap > 0 ? dailyCap : 500,
  };
}

export function checkScanRateLimit(
  ip: string,
  nowMs: number = Date.now(),
  overrides?: { perHour?: number; dailyCap?: number }
): RateLimitCheckResult {
  const defaults = getRateLimitConfig();
  const perHour = overrides?.perHour ?? defaults.perHour;
  const dailyCap = overrides?.dailyCap ?? defaults.dailyCap;

  const currentDay = getUtcDayKey(nowMs);
  if (dailyDayKey !== currentDay) {
    dailyDayKey = currentDay;
    dailyCount = 0;
  }

  // 1. Check global daily cap first
  if (dailyCount >= dailyCap) {
    const tomorrowUtc = new Date(`${currentDay}T00:00:00.000Z`).getTime() + 86400 * 1000;
    const retryAfter = Math.max(60, Math.ceil((tomorrowUtc - nowMs) / 1000));
    return {
      allowed: false,
      reason: "DAILY_CAP_REACHED",
      retryAfter,
      remainingIp: 0,
      remainingDaily: 0,
      message:
        "EUPass has reached its free global daily AI scan quota to keep this public service free. All static HS Code, EU AI Act, and GPSR reference directories remain available below.",
    };
  }

  // 2. Check per-IP sliding 1-hour window
  const windowMs = 60 * 60 * 1000;
  const normalizedIp = ip.trim() || "unknown";
  let bucket = ipMap.get(normalizedIp);
  if (!bucket) {
    bucket = { timestamps: [] };
    ipMap.set(normalizedIp, bucket);
  }

  bucket.timestamps = bucket.timestamps.filter((ts) => ts > nowMs - windowMs);

  if (bucket.timestamps.length >= perHour) {
    const oldest = bucket.timestamps[0];
    const retryAfter = Math.max(1, Math.ceil((oldest + windowMs - nowMs) / 1000));
    return {
      allowed: false,
      reason: "RATE_LIMIT_EXCEEDED",
      retryAfter,
      remainingIp: 0,
      remainingDaily: Math.max(0, dailyCap - dailyCount),
      message: `Hourly scan limit (${perHour}/hour per IP) reached. Please wait before running another live AI scan, or browse our static HS & EU AI Act directories.`,
    };
  }

  bucket.timestamps.push(nowMs);
  dailyCount += 1;

  return {
    allowed: true,
    remainingIp: Math.max(0, perHour - bucket.timestamps.length),
    remainingDaily: Math.max(0, dailyCap - dailyCount),
  };
}

export function resetRateLimiter(): void {
  ipMap.clear();
  dailyDayKey = "";
  dailyCount = 0;
}

export async function verifyTurnstileToken(
  token?: string | null,
  ip?: string
): Promise<{ valid: boolean; message?: string }> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // In local dev/test or when Turnstile secret is not configured, allow default dev token or non-bot requests
  if (!secretKey || secretKey.trim() === "") {
    if (token === "BOT_SIMULATION_FAIL") {
      return { valid: false, message: "Bot verification check failed." };
    }
    return { valid: true };
  }

  if (!token || token.trim() === "") {
    return {
      valid: false,
      message: "Please complete the bot verification challenge before scanning.",
    };
  }

  if (token === "XXXX.DUMMY.TOKEN.XXXX" && process.env.NODE_ENV !== "production") {
    return { valid: true };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (ip) formData.append("remoteip", ip);

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      return { valid: false, message: "Bot verification service unavailable." };
    }

    const data = (await res.json()) as { success?: boolean };
    if (!data.success) {
      return { valid: false, message: "Bot verification failed. Please refresh and try again." };
    }
    return { valid: true };
  } catch {
    return { valid: false, message: "Unable to verify security challenge." };
  }
}
