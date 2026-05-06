import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lock,
  AlertCircle,
  Loader,
  BookHeart,
  Users,
  MapPin,
  ShieldCheck,
  CreditCard,
  Info,
} from "lucide-react";
import { protectedAxios } from "../../axios";
import { useAuth } from "../hooks/useAuth";
import { useCurrency } from "../hooks/useCurrency";
import CurrencySelector from "../components/CurrencySelector";
import { useSubscriptionStore } from "../store/subscriptionStore";

const FEATURES = [
  "Unlimited journal entries",
  "Unlimited people profiles",
  "Unlimited place memories",
  "Cross-device sync",
  "End-to-end encryption",
  "Priority support",
];

const UNLOCKED = [
  { icon: BookHeart, label: "Journal", bg: "bg-journal-soft", color: "text-[var(--color-journal-light)]" },
  { icon: Users,     label: "People",  bg: "bg-people-soft",  color: "text-[var(--color-people-light)]" },
  { icon: MapPin,    label: "Places",  bg: "bg-places-soft",  color: "text-[var(--color-places-light)]" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const, delay },
});

export default function UpgradePage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { fetchStatus } = useSubscriptionStore();
  const { currency, setCurrency, detecting } = useCurrency();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin", { state: { from: "/upgrade" } });
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-default">
        <Loader className="h-7 w-7 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!user) return null;

  const price = billingPeriod === "yearly" ? currency.yearlyDisplay : currency.monthlyDisplay;

  const handleUpgrade = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await protectedAxios.post("/subscription/initialize", {
        billingPeriod,
        currency: currency.code,
      });

      const { email, amount, publicKey, reference, metadata, authorizationUrl } = response.data;

      if (!publicKey || !reference) {
        setError("Failed to initialize payment. Please try again.");
        setIsLoading(false);
        return;
      }

      // If Paystack inline script hasn't loaded yet, wait up to 3s then fall back
      if (!window.PaystackPop) {
        let waited = 0;
        await new Promise<void>((resolve) => {
          const check = setInterval(() => {
            waited += 100;
            if (window.PaystackPop || waited >= 3000) {
              clearInterval(check);
              resolve();
            }
          }, 100);
        });
      }

      if (!window.PaystackPop) {
        if (authorizationUrl) {
          window.location.href = authorizationUrl;
        } else {
          setError("Payment popup unavailable. Please try again.");
          setIsLoading(false);
        }
        return;
      }

      // Correct Paystack inline API: PaystackPop.setup({...}).openIframe()
      // NOTE: callback must be a plain function — Paystack rejects async functions
      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: email || user.email,
        amount,
        currency: currency.code,
        ref: reference,
        metadata,
        channels: currency.cardOnly
          ? ["card"]
          : ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"],
        callback: function(response) {
          // Plain function — kick off async work inside without making callback itself async
          setIsLoading(true);
          protectedAxios
            .post("/subscription/verify", { reference: response.reference })
            .then(() => fetchStatus())
            .then(() => {
              navigate("/payment/success?reference=" + response.reference);
            })
            .catch((err: any) => {
              setError(err?.message || "Payment verification failed. Please contact support.");
              setIsLoading(false);
            });
        },
        onClose: function() {
          setIsLoading(false);
        },
      });

      handler.openIframe();
      setIsLoading(false);
    } catch (err: any) {
      setError(err?.message || "Failed to initialize payment. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-default">
      {/* ── Top nav bar ── */}
      <div className="sticky top-0 z-40 border-b border-default bg-default/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate("/pricing")}
            className="flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft size={15} />
            Back to pricing
          </button>
          <div className="flex items-center gap-4">
            <CurrencySelector value={currency.code} onChange={setCurrency} />
            <div className="flex items-center gap-2 text-xs text-muted">
              <Lock size={12} className="text-primary-500" />
              Secured by Paystack
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
        {/* ── Page heading ── */}
        <motion.div {...fadeUp(0)} className="mb-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
            Checkout
          </p>
          <h1 className="font-display text-4xl font-normal tracking-tight text-primary sm:text-5xl">
            Unlock Chronovah Pro
          </h1>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-[1fr_420px]">

          {/* ── Left — payment form ── */}
          <motion.div {...fadeUp(0.08)} className="order-2 lg:order-1">
            <div className="rounded-2xl border border-default bg-card p-8">
              <h2 className="mb-6 text-xl font-bold text-primary">Complete your upgrade</h2>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/8 p-4"
                >
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </motion.div>
              )}

              {/* Account info */}
              <div className="mb-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">Name</label>
                  <div className="rounded-xl border border-default bg-default px-4 py-3 text-sm text-muted">{user.name}</div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">Email</label>
                  <div className="rounded-xl border border-default bg-default px-4 py-3 text-sm text-muted">{user.email}</div>
                </div>
              </div>

              {/* Currency selector */}
              <div className="mb-6">
                <label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-muted">Currency</label>
                {detecting ? (
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Loader size={14} className="animate-spin" />
                    Detecting your currency…
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(["NGN", "USD"] as const).map((code) => (
                      <button
                        key={code}
                        onClick={() => setCurrency(code)}
                        className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                          currency.code === code
                            ? "border-primary-500/70 bg-primary-500/10 text-primary"
                            : "border-default bg-default text-muted hover:border-primary-500/30"
                        }`}
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Billing period */}
              <div className="mb-6">
                <label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-muted">Billing period</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["monthly", "yearly"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setBillingPeriod(p)}
                      className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                        billingPeriod === p
                          ? "border-primary-500/70 bg-primary-500/5"
                          : "border-default bg-default hover:border-primary-500/30"
                      }`}
                    >
                      {p === "yearly" && (
                        <span className="absolute -top-2.5 -right-1 rounded-full bg-primary-600 px-2 py-0.5 text-[10px] font-bold text-white">
                          Save 17%
                        </span>
                      )}
                      <p className="text-sm font-semibold text-primary capitalize">{p}</p>
                      <p className="mt-0.5 text-sm text-muted">
                        {p === "yearly" ? currency.yearlyDisplay + " / year" : currency.monthlyDisplay + " / month"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment method note */}
              <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-default bg-default p-4">
                <CreditCard size={15} className="mt-0.5 shrink-0 text-primary-500" />
                <div>
                  <p className="text-xs font-semibold text-primary">
                    {currency.cardOnly
                      ? "Card payment only"
                      : "Card, bank transfer, and USSD available"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {currency.cardOnly
                      ? "Card payment only · Settled in NGN at current exchange rate"
                      : "NGN payments support all Paystack channels including bank transfer and USSD."}
                  </p>
                </div>
              </div>

              {/* Pay button */}
              <button
                onClick={handleUpgrade}
                disabled={isLoading || detecting}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-4 text-sm font-semibold text-white shadow-medium transition-all hover:bg-primary-700 hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    Pay {price} with Paystack
                    <ArrowRight size={15} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-xs text-muted">
                A secure Paystack popup will open to complete your payment.
              </p>

              {/* No-refund notice */}
              <div className="mt-5 rounded-xl border border-default bg-default p-4">
                <p className="text-xs leading-relaxed text-muted">
                  <span className="font-semibold text-primary">No refunds.</span>{" "}
                  All payments are final. You may cancel at any time to stop future charges — Pro access continues until the end of your billing period.
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── Right — order summary ── */}
          <motion.div {...fadeUp(0.14)} className="order-1 lg:order-2">
            <div className="sticky top-24 rounded-2xl border border-default bg-card p-8">
              <h2 className="mb-6 text-lg font-bold text-primary">Order summary</h2>

              {/* What's unlocked */}
              <div className="mb-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">Sections unlocked</p>
                <div className="space-y-2.5">
                  {UNLOCKED.map(({ icon: Icon, label, bg, color }) => (
                    <div key={label} className={`flex items-center gap-3 rounded-xl border border-default ${bg} px-4 py-3`}>
                      <Icon size={18} className={`shrink-0 ${color}`} strokeWidth={1.75} />
                      <span className="text-sm font-semibold text-primary">{label}</span>
                      <span className="ml-auto text-xs text-muted">Unlimited</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="mb-6 border-t border-default pt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">Includes</p>
                <ul className="space-y-2.5">
                  {FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-muted">
                      <Check size={14} className="shrink-0 text-primary-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price summary */}
              <div className="border-t border-default pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">
                    Chronovah Pro · {billingPeriod === "yearly" ? "Yearly" : "Monthly"}
                  </span>
                  <span className="text-base font-bold text-primary">{price}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted">Billed</span>
                  <span className="text-xs text-muted">
                    {billingPeriod === "yearly" ? "Once per year" : "Every month"}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted">Currency</span>
                  <span className="text-xs font-medium text-primary">{currency.code}</span>
                </div>
              </div>

              {/* USD note */}
              {currency.cardOnly && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-yellow-500/30 bg-yellow-500/5 px-4 py-3">
                  <Info size={14} className="mt-0.5 shrink-0 text-yellow-600 dark:text-yellow-400" />
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    USD payments are card only and settled in NGN at the current exchange rate.
                  </p>
                </div>
              )}

              {/* Trust */}
              <div className="mt-6 flex items-center gap-2 rounded-xl border border-default bg-default px-4 py-3">
                <ShieldCheck size={15} className="shrink-0 text-primary-500" />
                <p className="text-xs text-muted">Secured by Paystack · PCI-DSS compliant</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
