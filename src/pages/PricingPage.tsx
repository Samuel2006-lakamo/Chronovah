import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Check,
  Lock,
  ArrowRight,
  WifiOff,
  ShieldCheck,
  RefreshCw,
  Zap,
  BookHeart,
  Users,
  MapPin,
  NotebookPen,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useSubscriptionStore } from "../store/subscriptionStore";
import { useLiveQuery } from "dexie-react-hooks";
import { useCurrency } from "../hooks/useCurrency";
import CurrencySelector from "../components/CurrencySelector";
import Header from "../components/Header";
import Footer from "../components/Footer";
import db from "../database/db";

/* ─── data ─────────────────────────────────────────────────── */
const FREE_FEATURES = [
  "Unlimited notes",
  "Basic offline access",
  "End-to-end encryption",
  "Up to 20 journal entries",
  "Up to 12 people",
  "Up to 15 places",
];

const PRO_FEATURES = [
  "Everything in Starter",
  "Unlimited journal entries",
  "Unlimited people profiles",
  "Unlimited place memories",
  "Cross-device sync",
  "Priority support",
];

const TRUST_ITEMS = [
  { icon: WifiOff,     label: "Offline-first" },
  { icon: ShieldCheck, label: "Encrypted locally" },
  { icon: RefreshCw,   label: "Cancel anytime" },
  { icon: Zap,         label: "Instant access" },
];

const PILLARS = [
  { icon: NotebookPen, label: "Notes",   bg: "bg-notes-soft",   color: "text-[var(--color-notes-light)]",   desc: "Unlimited, always" },
  { icon: BookHeart,   label: "Journal", bg: "bg-journal-soft", color: "text-[var(--color-journal-light)]", desc: "Unlimited with Pro" },
  { icon: Users,       label: "People",  bg: "bg-people-soft",  color: "text-[var(--color-people-light)]",  desc: "Unlimited with Pro" },
  { icon: MapPin,      label: "Places",  bg: "bg-places-soft",  color: "text-[var(--color-places-light)]",  desc: "Unlimited with Pro" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay },
});

/* ─── component ─────────────────────────────────────────────── */
export default function PricingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isProActive } = useSubscriptionStore();
  const [yearly, setYearly] = useState(false);
  const { currency, setCurrency } = useCurrency();

  const journalCount = useLiveQuery(
    async () => (user ? db.journal.where("userId").equals(user.id).count() : 0),
    [user?.id]
  ) ?? 0;
  const peopleCount = useLiveQuery(
    async () => (user ? db.people.where("userId").equals(user.id).count() : 0),
    [user?.id]
  ) ?? 0;
  const placesCount = useLiveQuery(
    async () => (user ? db.places.where("userId").equals(user.id).count() : 0),
    [user?.id]
  ) ?? 0;

  const price = yearly ? currency.yearlyDisplay : currency.monthlyDisplay;
  const period = yearly ? "/ year" : "/ month";

  const handleUpgrade = () => {
    if (!user) navigate("/signin", { state: { from: "/pricing" } });
    else navigate("/upgrade");
  };

  /* ── Pro-active state ── */
  if (isProActive) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center bg-default px-6 py-24">
          <motion.div {...fadeUp(0)} className="max-w-lg text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-glow">
              <Zap size={28} />
            </div>
            <h1 className="font-display mb-4 text-4xl font-normal tracking-tight text-primary sm:text-5xl">
              You are on Pro
            </h1>
            <p className="mb-8 text-lg text-muted">
              All features unlocked. Your full digital vault is ready.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-8 py-3.5 text-sm font-semibold text-white shadow-medium transition-colors hover:bg-primary-700"
            >
              Go to Dashboard
              <ArrowRight size={15} strokeWidth={2.5} />
            </button>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-default">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden border-b border-default py-24 md:py-32">
          {/* Grid bg */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.055]"
            style={{
              backgroundImage:
                "linear-gradient(var(--color-border) 1px,transparent 1px),linear-gradient(90deg,var(--color-border) 1px,transparent 1px)",
              backgroundSize: "64px 64px",
            }}
            aria-hidden
          />
          <div className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary-500/[0.07] blur-[120px]" aria-hidden />

          <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-8">
            <motion.p {...fadeUp(0)} className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Pricing
            </motion.p>
            <motion.h1 {...fadeUp(0.07)} className="font-display text-4xl font-normal tracking-tight text-primary sm:text-5xl md:text-[3.25rem]">
              Start free.
              <br />
              <span className="text-primary-600 dark:text-primary-400">
                Unlock everything when ready.
              </span>
            </motion.h1>
            <motion.p {...fadeUp(0.14)} className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Notes are free forever. Upgrade to Pro for unlimited Journal,
              People, and Places.
            </motion.p>

            {/* Billing toggle */}
            <motion.div {...fadeUp(0.2)} className="mt-10 flex flex-col items-center gap-4">
              <div className="inline-flex items-center gap-1 rounded-xl border border-default bg-card p-1">
                <button
                  onClick={() => setYearly(false)}
                  className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors ${
                    !yearly ? "bg-default text-primary shadow-soft" : "text-muted hover:text-primary"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setYearly(true)}
                  className={`relative rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors ${
                    yearly ? "bg-default text-primary shadow-soft" : "text-muted hover:text-primary"
                  }`}
                >
                  Yearly
                  {yearly && (
                    <span className="absolute -top-2.5 -right-2 rounded-full bg-primary-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      −17%
                    </span>
                  )}
                </button>
              </div>
              <CurrencySelector value={currency.code} onChange={setCurrency} />
            </motion.div>
          </div>
        </section>

        {/* ── Pricing cards ── */}
        <section className="border-b border-default py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <div className="grid gap-6 md:grid-cols-2">

              {/* Free */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col rounded-2xl border border-default bg-card p-8"
              >
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted">Starter</p>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-5xl font-bold text-primary">Free</span>
                  </div>
                  <p className="mt-2 text-sm text-muted">Forever. No time limit.</p>
                </div>

                <ul className="mb-8 flex-1 space-y-3.5">
                  {FREE_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-[0.9375rem] text-muted">
                      <Check size={15} className="shrink-0 text-primary-500" />
                      {f}
                    </li>
                  ))}
                  <li className="pt-2 border-t border-default" />
                  {[
                    { name: "Journal", count: journalCount, limit: 20 },
                    { name: "People",  count: peopleCount,  limit: 12 },
                    { name: "Places",  count: placesCount,  limit: 15 },
                  ].map(({ name, count, limit }) => (
                    <li key={name} className="flex items-center gap-3 text-[0.9375rem] opacity-50">
                      <Lock size={14} className="shrink-0 text-muted" />
                      <span className="text-muted line-through">
                        {name} — {count}/{limit} used
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate(user ? "/dashboard" : "/signup")}
                  className="w-full rounded-xl border border-default bg-default py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-card"
                >
                  {user ? "Current plan" : "Get started free"}
                </button>
              </motion.div>

              {/* Pro */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.18 }}
                className="relative flex flex-col rounded-2xl border-2 border-primary-500/70 bg-card p-8 shadow-medium"
              >
                {/* Top accent line */}
                <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-primary-600 to-primary-400" />

                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-4 py-1 text-xs font-bold text-white">
                  Most popular
                </div>

                <div className="mb-6 mt-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">Pro</p>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-5xl font-bold text-primary">{price}</span>
                    <span className="text-sm text-muted">{period}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted">Full vault, no limits.</p>
                </div>

                <ul className="mb-8 flex-1 space-y-3.5">
                  {PRO_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-[0.9375rem] text-muted">
                      <Check size={15} className="shrink-0 text-primary-500" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleUpgrade}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-primary-700 hover:shadow-glow"
                >
                  Upgrade to Pro
                  <ArrowRight size={15} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5" />
                </button>

                <p className="mt-4 text-center text-xs text-muted">
                  Cancel anytime.{" "}
                  <span className="font-semibold text-primary">All payments are final — no refunds.</span>
                </p>
              </motion.div>
            </div>

            {/* Refund notice */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 text-center text-xs text-muted"
            >
              <span className="font-semibold text-primary">No refunds.</span>{" "}
              All payments are final. Cancel anytime to stop future charges — Pro access continues until the end of your billing period.
            </motion.p>
          </div>
        </section>

        {/* ── What's included ── */}
        <section className="border-b border-default py-20 md:py-24">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <h2 className="font-display text-3xl font-normal tracking-tight text-primary sm:text-4xl">
                Everything in one workspace
              </h2>
              <p className="mt-3 text-muted">
                Four sections. One dashboard. All offline-first.
              </p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PILLARS.map(({ icon: Icon, label, bg, color, desc }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className={`flex flex-col items-start rounded-2xl border border-default ${bg} p-6`}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-default bg-card">
                    <Icon size={20} className={color} strokeWidth={1.75} />
                  </div>
                  <p className="text-base font-semibold text-primary">{label}</p>
                  <p className="mt-1 text-sm text-muted">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Trust bar ── */}
        <section className="border-b border-default py-14">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {TRUST_ITEMS.map(({ icon: Icon, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-default bg-card p-6 text-center"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10">
                    <Icon size={18} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <p className="text-sm font-medium text-primary">{label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ mini ── */}
        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-2xl px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display mb-10 text-center text-3xl font-normal tracking-tight text-primary sm:text-4xl"
            >
              Quick answers
            </motion.h2>
            <div className="space-y-5">
              {[
                {
                  q: "Can I cancel my subscription?",
                  a: "Yes, cancel anytime from your billing page. Your Pro access continues until the end of the current billing period.",
                },
                {
                  q: "Are there refunds?",
                  a: "No. All payments are final. Please review the plan carefully before purchasing.",
                },
                {
                  q: "What happens to my data if I cancel?",
                  a: "Your notes stay free forever. Journal, People, and Places become read-only until you re-subscribe.",
                },
                {
                  q: "Is payment secure?",
                  a: "Payments are processed by Paystack, a PCI-DSS compliant provider. We never store your card details.",
                },
              ].map(({ q, a }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="rounded-2xl border border-default bg-card p-6"
                >
                  <p className="mb-2 text-base font-semibold text-primary">{q}</p>
                  <p className="text-[0.9375rem] leading-relaxed text-muted">{a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
