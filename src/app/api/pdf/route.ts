import { NextResponse } from "next/server";
import { generateEuPassPdfBuffer } from "@/lib/pdf/generator";
import { euPassLlmResponseZodSchema, type EuPassScanResult } from "@/lib/schema";
import { getVerifiedDate } from "@/lib/scanner";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { result?: EuPassScanResult };
    if (!body || !body.result) {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", message: "Missing scan result payload." } },
        { status: 400 }
      );
    }

    const parsed = euPassLlmResponseZodSchema.safeParse(body.result);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "INVALID_RESULT_SCHEMA", message: "Invalid scan result format." } },
        { status: 400 }
      );
    }

    const verifiedDate = getVerifiedDate();
    const scanResult: EuPassScanResult = {
      ...parsed.data,
      scan_id: body.result.scan_id || `eupass_${Date.now().toString(36)}`,
      verified_date: verifiedDate,
      created_at: body.result.created_at || new Date().toISOString(),
      commercial_invoice_snippet: body.result.commercial_invoice_snippet || null,
    };

    const pdfBuffer = await generateEuPassPdfBuffer(scanResult, verifiedDate);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="EUPass-Compliance-Report-${scanResult.scan_id}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: { code: "PDF_GENERATION_FAILED", message: "Failed to generate PDF report." } },
      { status: 500 }
    );
  }
}
