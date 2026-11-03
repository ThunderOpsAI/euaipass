import { NextResponse } from "next/server";
import { checkScanRateLimit, verifyTurnstileToken } from "@/lib/rate-limit";
import { ScanValidationError } from "@/lib/router";
import { runEuPassScan } from "@/lib/scanner";

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    return xff.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "127.0.0.1";
}

export async function POST(req: Request) {
  const ip = getClientIp(req);

  // 1. Enforce per-IP hourly rate limit and global daily cap BEFORE reading/processing LLM
  const rateStatus = checkScanRateLimit(ip);
  if (!rateStatus.allowed) {
    return NextResponse.json(
      {
        error: {
          code: rateStatus.reason || "RATE_LIMIT_EXCEEDED",
          message:
            rateStatus.message ||
            "Rate limit reached. You can continue browsing all static HS Code, EU AI Act, and Product Safety guides.",
          retryAfter: rateStatus.retryAfter ?? 3600,
        },
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateStatus.retryAfter ?? 3600),
        },
      }
    );
  }

  let description = "";
  let image: { buffer: Buffer; mimeType: string } | null = null;
  let turnstileToken: string | null = null;

  try {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const rawDesc = form.get("description");
      description = typeof rawDesc === "string" ? rawDesc : "";
      const rawToken = form.get("turnstileToken");
      turnstileToken = typeof rawToken === "string" ? rawToken : null;

      const file = form.get("image");
      if (file && typeof file === "object" && "arrayBuffer" in file && file.size > 0) {
        const ab = await file.arrayBuffer();
        image = {
          buffer: Buffer.from(ab),
          mimeType: file.type || " application/octet-stream",
        };
      }
    } else {
      const body = (await req.json()) as {
        description?: string;
        imageBase64?: string;
        imageMimeType?: string;
        turnstileToken?: string;
      };
      description = typeof body.description === "string" ? body.description : "";
      turnstileToken = body.turnstileToken ?? null;
      if (body.imageBase64 && body.imageMimeType) {
        image = {
          buffer: Buffer.from(body.imageBase64, "base64"),
          mimeType: body.imageMimeType,
        };
      }
    }
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_PAYLOAD",
          message: "Unable to parse scan request payload.",
        },
      },
      { status: 400 }
    );
  }

  // 2. Verify Turnstile / bot challenge before invoking LLM
  const botCheck = await verifyTurnstileToken(turnstileToken, ip);
  if (!botCheck.valid) {
    return NextResponse.json(
      {
        error: {
          code: "BOT_CHECK_FAILED",
          message: botCheck.message || "Bot verification failed.",
        },
      },
      { status: 403 }
    );
  }

  // 3. Execute in-memory 3-pillar scan (Step A Router -> Step B HS RAG -> Step C Single Gemini Pass)
  try {
    const result = await runEuPassScan({ description, image });
    return NextResponse.json({ result });
  } catch (err: unknown) {
    if (err instanceof ScanValidationError) {
      return NextResponse.json(
        {
          error: {
            code: err.code,
            message: err.message,
          },
        },
        { status: err.statusCode }
      );
    }

    return NextResponse.json(
      {
        error: {
          code: "SCAN_FAILED",
          message: "An unexpected error occurred while evaluating EU compliance.",
        },
      },
      { status: 500 }
    );
  }
}
