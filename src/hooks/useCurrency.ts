/**
 * useCurrency — auto-detects user currency from IP, allows manual override.
 * localStorage preference always takes priority over detection.
 * Defaults to NGN silently on any failure.
 */
import { useState, useEffect } from "react";
import { publicAxios } from "../../axios";

export type CurrencyCode = "NGN" | "USD" | "GBP" | "EUR";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  monthly: number;       // price in major units (e.g. 2500, 2.99)
  yearly: number;
  monthlyDisplay: string; // formatted string e.g. "₦2,500"
  yearlyDisplay: string;
  // NGN supports all Paystack channels; others are card-only
  cardOnly: boolean;
}

const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  NGN: {
    code: "NGN",
    symbol: "₦",
    monthly: 2500,
    yearly: 25000,
    monthlyDisplay: "₦2,500",
    yearlyDisplay: "₦25,000",
    cardOnly: false,
  },
  USD: {
    code: "USD",
    symbol: "$",
    monthly: 2.99,
    yearly: 29.99,
    monthlyDisplay: "$2.99",
    yearlyDisplay: "$29.99",
    cardOnly: true,
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    monthly: 2.49,
    yearly: 24.99,
    monthlyDisplay: "£2.49",
    yearlyDisplay: "£24.99",
    cardOnly: true,
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    monthly: 2.79,
    yearly: 27.99,
    monthlyDisplay: "€2.79",
    yearlyDisplay: "€27.99",
    cardOnly: true,
  },
};

const STORAGE_KEY = "chronovah_currency";

export function useCurrency() {
  const [currency, setCurrencyState] = useState<CurrencyConfig>(CURRENCIES.NGN);
  const [detecting, setDetecting] = useState(true);

  useEffect(() => {
    // 1. Check localStorage first — user preference always wins
    const stored = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
    if (stored && CURRENCIES[stored]) {
      setCurrencyState(CURRENCIES[stored]);
      setDetecting(false);
      return;
    }

    // 2. Auto-detect from backend (which uses IP geolocation)
    (async () => {
      try {
        const { data } = await publicAxios.get("/subscription/detect-currency");
        const detected = (data.currency as CurrencyCode) || "NGN";
        const config = CURRENCIES[detected] || CURRENCIES.NGN;
        setCurrencyState(config);
      } catch {
        // Silently default to NGN
        setCurrencyState(CURRENCIES.NGN);
      } finally {
        setDetecting(false);
      }
    })();
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    const config = CURRENCIES[code] || CURRENCIES.NGN;
    setCurrencyState(config);
    localStorage.setItem(STORAGE_KEY, code);
  };

  return {
    currency,
    setCurrency,
    detecting,
    allCurrencies: Object.values(CURRENCIES),
  };
}

export { CURRENCIES };
