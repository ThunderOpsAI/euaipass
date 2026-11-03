import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import type { EuPassScanResult } from "@/lib/schema";
import { EuPassReportDocument } from "./report-document";
import { getVerifiedDate } from "@/lib/scanner";

export async function generateEuPassPdfBuffer(
  result: EuPassScanResult,
  verifiedDate?: string
): Promise<Buffer> {
  const effectiveDate = verifiedDate || getVerifiedDate();
  const doc = React.createElement(EuPassReportDocument, {
    result,
    verifiedDate: effectiveDate,
  });

  const buffer = await renderToBuffer(
    doc as unknown as Parameters<typeof renderToBuffer>[0]
  );
  return Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
}
