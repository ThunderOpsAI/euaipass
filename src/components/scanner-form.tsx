"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Sparkles, Loader2, X } from "lucide-react";
import type { EuPassScanResult } from "@/lib/schema";

interface ScannerFormProps {
  onScanComplete?: (result: EuPassScanResult) => void;
  className?: string;
  defaultDescription?: string;
}

export function ScannerForm({
  onScanComplete,
  className = "",
  defaultDescription = "",
}: ScannerFormProps) {
  const router = useRouter();
  const [description, setDescription] = useState(defaultDescription);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrorMessage("Image must be JPEG, PNG, or WebP format.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image size must be 5 MB or less.");
      return;
    }

    setErrorMessage(null);
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmed = description.trim();
    if (trimmed.length < 10) {
      setErrorMessage("Please enter at least 10 characters describing the product.");
      return;
    }
    if (trimmed.length > 1000) {
      setErrorMessage("Description exceeds 1,000 characters limit.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("description", trimmed);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch("/api/scan", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || `Scan request failed (${res.status})`);
      }

      if (data?.result) {
        try {
          localStorage.setItem("eupass_active_scan", JSON.stringify(data.result));
        } catch {
          // ignore localStorage quota errors
        }
        if (onScanComplete) {
          onScanComplete(data.result);
        } else {
          // If scanner is embedded in a sub-page, navigate to / with active scan
          router.push("/#results");
        }
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to run scan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      data-testid="unified-scanner-form"
      onSubmit={handleSubmit}
      className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-5 sm:p-7 shadow-xl shadow-blue-500/5 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Check Any Product for EU Market Entry
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            One intake for Customs HS codes, GPSR/CE safety rules, and EU AI Act risk tiers.
          </p>
        </div>
        <span className="hidden sm:inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
          100% Free & In-Memory
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="product-description" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Product Description or Technical Specification
          </label>
          <textarea
            id="product-description"
            data-testid="scanner-description-input"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. '100% cotton crewneck t-shirt with screen print', 'AI resume screening SaaS for candidate ranking', or 'smart baby monitor with Wi-Fi and facial emotion recognition'..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition"
          />
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
            <span>Minimum 10 characters</span>
            <span className={description.length > 1000 ? "text-red-500 font-bold" : ""}>
              {description.length} / 1,000
            </span>
          </div>
        </div>

        {/* Optional Image Upload */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Optional Product Photo (JPEG, PNG, WebP ≤ 5 MB)
          </label>
          {!imagePreview ? (
            <label
              htmlFor="product-image"
              className="flex items-center justify-center gap-2 p-3.5 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-xl cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
            >
              <UploadCloud className="w-4 h-4 text-slate-400" />
              <span>Attach product label or photo</span>
              <input
                id="product-image"
                data-testid="scanner-image-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="flex items-center gap-3 p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Upload preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                  {imageFile?.name || "Uploaded photo"}
                </p>
                <p className="text-[10px] text-slate-400">
                  {imageFile ? `${(imageFile.size / 1024).toFixed(1)} KB` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {errorMessage && (
          <div
            data-testid="scanner-error"
            className="p-3 text-xs rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300"
          >
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          data-testid="scanner-submit-btn"
          disabled={isLoading}
          className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 disabled:opacity-50 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing EU Customs, Safety & AI Directives...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Free EU Market Pass</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
