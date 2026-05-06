import { Globe } from "lucide-react";
import type { CurrencyCode } from "../hooks/useCurrency";
import { CURRENCIES } from "../hooks/useCurrency";

interface CurrencySelectorProps {
  value: CurrencyCode;
  onChange: (code: CurrencyCode) => void;
  className?: string;
}

export default function CurrencySelector({ value, onChange, className = "" }: CurrencySelectorProps) {
  return (
    <div className={`relative inline-flex items-center gap-1.5 ${className}`}>
      <Globe size={14} className="text-muted shrink-0" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as CurrencyCode)}
        className="appearance-none bg-transparent text-sm font-medium text-primary cursor-pointer focus:outline-none pr-4"
        aria-label="Select currency"
      >
        {Object.values(CURRENCIES).map((c) => (
          <option key={c.code} value={c.code}>
            {c.symbol} {c.code}
          </option>
        ))}
      </select>
      {/* Chevron */}
      <svg
        className="pointer-events-none absolute right-0 text-muted"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
