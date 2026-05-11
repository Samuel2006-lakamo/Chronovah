/**
 * ImageCounter.tsx
 *
 * Displays per-record and global image usage counts.
 *
 * Per-record: "2 of 5 images" (always shown)
 * Global:     "24 of 30 free images used" (free users only)
 */

import { Images } from "lucide-react";

interface ImageCounterProps {
  perRecordCount: number;
  perRecordLimit: number;
  globalCount: number;
  globalLimit: number | null;
  plan: "free" | "pro";
  className?: string;
}

export default function ImageCounter({
  perRecordCount,
  perRecordLimit,
  globalCount,
  globalLimit,
  plan,
  className = "",
}: ImageCounterProps) {
  const isAtPerRecordLimit = perRecordCount >= perRecordLimit;
  const isAtGlobalLimit =
    plan === "free" && globalLimit !== null && globalCount >= globalLimit;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {/* Per-record counter */}
      <div
        className={`flex items-center gap-1.5 text-xs font-medium ${
          isAtPerRecordLimit ? "text-red-500" : "text-muted"
        }`}
        aria-label={`${perRecordCount} of ${perRecordLimit} images used for this entry`}
      >
        <Images size={13} className="flex-shrink-0" />
        <span>
          {perRecordCount} of {perRecordLimit}{" "}
          {isAtPerRecordLimit ? (
            <span className="text-red-500 font-semibold">• limit reached</span>
          ) : (
            "images"
          )}
        </span>
      </div>

      {/* Global counter — free users only */}
      {plan === "free" && globalLimit !== null && (
        <div
          className={`text-xs ${
            isAtGlobalLimit ? "text-red-500 font-medium" : "text-muted"
          }`}
          aria-label={`${globalCount} of ${globalLimit} free images used globally`}
        >
          {isAtGlobalLimit ? (
            <span>Free limit reached ({globalCount}/{globalLimit})</span>
          ) : (
            <span>
              {globalCount} of {globalLimit} free images used
            </span>
          )}
        </div>
      )}
    </div>
  );
}
