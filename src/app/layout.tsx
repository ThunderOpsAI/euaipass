import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Navbar, Footer } from "@/components/navigation";
import { ConsentProvider } from "@/lib/consent";
import { ConsentBanner } from "@/components/consent-banner";

export const viewport: Viewport = {
  themeColor: "#003399",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://euaipass.com"),
  title: {
    template: "%s | EUPass EU Compliance Hub",
    default: "EUPass — Can I Sell or Ship This Product into the EU?",
  },
  description:
    "Free, instant EU compliance screener: 6-digit Customs HS codes, GPSR & CE product safety directives, and EU AI Act risk tier classification.",
  keywords: [
    "EU market entry",
    "HS code classifier",
    "EU AI Act compliance",
    "GPSR EU Responsible Person",
    "CE marking",
    "Digital Product Passport",
    "IOSS threshold",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    siteName: "EUPass",
    type: "website",
    locale: "en_IE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        {adsenseClient && adsenseClient.trim() !== "" ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        ) : null}
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-500 selection:text-white">
        <ConsentProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ConsentBanner />
        </ConsentProvider>
      </body>
    </html>
  );
}
