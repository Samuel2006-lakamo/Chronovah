import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubscriptionStore } from "../../store/subscriptionStore";
import { useCurrency } from "../../hooks/useCurrency";
import CurrencySelector from "../../components/CurrencySelector";

const FREE_FEATURES = [
  "Unlimited notes",
  "Up to 20 journal entries",
  "Up to 12 people",
  "Up to 15 places",
  "Offline access",
  "End-to-end encryption",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Unlimited journal entries",
  "Unlimited people profiles",
  "Unlimited place memories",
  "Cross-device sync",
  "Priority support",
];

export default function PricingSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const navigate = useNavigate();
  const { isProActive } = useSubscriptionStore();
  const [yearly, setYearly] = useState(false);
  const { currency, setCurrency } = useCurrency();

  const price = yearly ? currency.yearlyDisplay : currency.monthlyDisplay;
  const period = yearly ? "/ year" : "/ month";
  const saving = yearly ? "Save 17%" : null;

  return (
    <section
      id="pricing"
      ref={ref}
      className="relative border-b border-default bg-card py-24 md:py-32"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
            Pricing
          </p>
          <h2
            id="pricing-heading"
            className="font-display text-4xl font-normal tracking-tight text-primary sm:text-5xl"
          >
            Simple, honest pricing
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted">
            Notes are free forever. Upgrade when you need the full vault.
          </p>

          {/* Toggle */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="inline-flex items-center gap-1 rounded-xl border border-default bg-default p-1">
              <button
                onClick={() => setYearly(false)}
                className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors ${
                  !yearly ? "bg-card text-primary shadow-soft" : "text-muted hover:text-primary"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setYearly(true)}
                className={`relative rounded-lg px-5 py-2 text-sm font-medium transition-colors ${
                  yearly ? "bg-card text-primary shadow-soft" : "text-muted hover:text-primary"
                }`}
              >
                Yearly
                {saving && (
                  <span className="absolute -top-2.5 -right-2 rounded-full bg-primary-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {saving}
                  </span>
                )}
              </button>
            </div>
            <CurrencySelector value={currency.code} onChange={setCurrency} />
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="flex flex-col rounded-2xl border border-default bg-default p-8"
          >
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">Starter</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-primary">Free</span>
              </div>
              <p className="mt-2 text-sm text-muted">Forever. No time limit.</p>
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 text-[0.9375rem] text-muted">
                  <Check size={15} className="shrink-0 text-primary-500" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate("/signup")}
              className="w-full rounded-xl border border-default bg-card py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-default"
            >
              Get started free
            </button>
          </motion.div>

          {/* Pro */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="relative flex flex-col rounded-2xl border-2 border-primary-500/60 bg-default p-8 shadow-medium"
          >
            {/* Popular badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-4 py-1 text-xs font-bold text-white">
              Most popular
            </div>

            {isProActive && (
              <div className="absolute -top-3.5 right-6 rounded-full bg-accent-green px-3 py-1 text-xs font-bold text-white">
                Active
              </div>
            )}

            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
                Pro
              </p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-primary">{price}</span>
                <span className="text-sm text-muted">{period}</span>
              </div>
              <p className="mt-2 text-sm text-muted">Full vault, no limits.</p>
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 text-[0.9375rem] text-muted">
                  <Check size={15} className="shrink-0 text-primary-500" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate(isProActive ? "/billing" : "/upgrade")}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-primary-700"
            >
              {isProActive ? "Manage plan" : "Upgrade to Pro"}
              <ArrowRight size={15} strokeWidth={2.5} />
            </button>

            <p className="mt-4 text-center text-xs text-muted">
              Cancel anytime.{" "}
              <span className="font-medium text-primary">
                All payments are final — no refunds.
              </span>
            </p>
          </motion.div>
        </div>

        {/* Refund policy notice */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-8 text-center text-xs text-muted"
        >
          <span className="font-semibold text-primary">No refunds.</span>{" "}
          All payments are final. You may cancel at any time to stop future charges — access continues until the end of your billing period. Please review the plan before purchasing.
        </motion.p>
      </div>
    </section>
  );
}
