import { NextResponse } from "next/server";

export function formatAdsTxt(adsenseClient?: string | null): string {
  const raw = (adsenseClient || "").trim();
  if (!raw) {
    return "# EUPass ads.txt — Set NEXT_PUBLIC_ADSENSE_CLIENT (e.g. ca-pub-XXXXXXXXXXXXXXXX) to publish your Google AdSense seller record.\n";
  }
  const pubId = raw.startsWith("ca-pub-")
    ? raw.replace(/^ca-/, "")
    : raw.startsWith("pub-")
    ? raw
    : `pub-${raw}`;
  return `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`;
}

export async function GET() {
  const content = formatAdsTxt(process.env.NEXT_PUBLIC_ADSENSE_CLIENT);
  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
