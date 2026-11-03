import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-md shadow-blue-500/20">
            EU
          </div>
          <span className="font-extrabold text-lg sm:text-xl text-slate-950 dark:text-white tracking-tight">
            EUPass<span className="text-blue-600">.eu</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link href="/hs" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            HS Tariff Codes
          </Link>
          <Link href="/eu-ai-act" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            EU AI Act
          </Link>
          <Link href="/product-safety" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            Product Safety & GPSR
          </Link>
          <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/#scanner"
            className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Free Scanner</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              EU
            </div>
            <span className="font-bold text-base text-slate-900 dark:text-white">EUPass</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            Free, automated compliance screening for shipping products into the European Single Market. Not affiliated with the European Commission.
          </p>
          <p className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} EUPass. All rights reserved.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
            HS Tariff Directory
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <li><Link href="/hs/61" className="hover:underline">Chapter 61: Knitted Apparel</Link></li>
            <li><Link href="/hs/62" className="hover:underline">Chapter 62: Woven Apparel</Link></li>
            <li><Link href="/hs/84" className="hover:underline">Chapter 84: Machinery & Computers</Link></li>
            <li><Link href="/hs/85" className="hover:underline">Chapter 85: Electronics & Audio</Link></li>
            <li><Link href="/hs" className="hover:underline font-semibold text-blue-600">All 96 Chapters →</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
            EU Regulations
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <li><Link href="/eu-ai-act" className="hover:underline">EU AI Act (2024/1689)</Link></li>
            <li><Link href="/product-safety/gpsr-guide" className="hover:underline">GPSR Guide (2023/988)</Link></li>
            <li><Link href="/product-safety/eu-responsible-person" className="hover:underline">EU Responsible Person</Link></li>
            <li><Link href="/product-safety/digital-product-passport" className="hover:underline">Digital Product Passport (ESPR)</Link></li>
            <li><Link href="/product-safety/ioss-vat-threshold" className="hover:underline">€150 IOSS VAT Threshold</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
            Transparency & Legal
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <li><Link href="/about" className="hover:underline">About EUPass</Link></li>
            <li><Link href="/privacy" className="hover:underline">Privacy Policy (Cookies & Ads)</Link></li>
            <li><Link href="/terms" className="hover:underline">Terms of Service</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact & Editorial</Link></li>
            <li><Link href="/ads.txt" className="hover:underline font-mono text-[11px]">ads.txt</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
