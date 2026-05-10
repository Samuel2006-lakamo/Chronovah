import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  ArrowRight,
  MapPin,
  NotebookPen,
  Users,
  BookHeart,
  ShieldCheck,
  WifiOff,
  Clock,
} from "lucide-react";

const PILLARS = [
  { icon: MapPin,      label: "Places",  bg: "bg-places-soft",  color: "text-[var(--color-places-light)]" },
  { icon: NotebookPen, label: "Notes",   bg: "bg-notes-soft",   color: "text-[var(--color-notes-light)]" },
  { icon: Users,       label: "People",  bg: "bg-people-soft",  color: "text-[var(--color-people-light)]" },
  { icon: BookHeart,   label: "Journal", bg: "bg-journal-soft", color: "text-[var(--color-journal-light)]" },
];

const ACTIVITY = [
  { dot: "bg-notes-soft",   border: "border-[var(--color-notes-light)]",   text: "Added note — Meeting recap",     time: "2m ago" },
  { dot: "bg-places-soft",  border: "border-[var(--color-places-light)]",  text: "Saved place — Kyoto, Japan",     time: "1h ago" },
  { dot: "bg-people-soft",  border: "border-[var(--color-people-light)]",  text: "Updated contact — Sarah K.",     time: "3h ago" },
];

const TRUST = [
  { icon: ShieldCheck, label: "Private by default" },
  { icon: WifiOff,     label: "Works offline" },
  { icon: Clock,       label: "Sync on reconnect" },
];

// Smooth, warm ease — feels like a breath, not a bounce
const ease = [0.25, 0.1, 0.25, 1] as const;

const softUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
});

const softFade = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8, ease, delay },
});

export default function Hero() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  return (
    <section
      ref={ref}
      className="relative flex min-h-[94vh] items-center overflow-hidden border-b border-default bg-default"
      aria-label="Hero"
    >
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.055]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-border) 1px,transparent 1px),linear-gradient(90deg,var(--color-border) 1px,transparent 1px)",
          backgroundSize: "72px 72px",
        }}
        aria-hidden
      />

      {/* Ambient glows — softer, more diffuse */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full bg-primary-500/[0.06] blur-[160px]" aria-hidden />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-secondary-500/[0.05] blur-[140px]" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-28 sm:py-32 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.05fr]">

          {/* LEFT — copy */}
          <div className="flex flex-col">

            
            {/* Headline — Bricolage Grotesque, warm and editorial */}
            <motion.h1
              {...softUp(0.08)}
              className="font-display text-[2.75rem] font-semibold leading-[1.1] tracking-[-0.02em] text-primary sm:text-5xl lg:text-[3.75rem]"
            >
              One place for
              <br />
              <span className="text-primary-600">
                everything that matters
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p {...softUp(0.18)}
              className="mt-6 max-w-[480px] text-[1.05rem] leading-[1.75] text-muted"
            >
              Chronovah brings your notes, places, people, and journal into a
              single offline-first workspace — structured, private, and fast.
            </motion.p>

            {/* CTAs */}
            <motion.div {...softUp(0.26)} className="mt-10 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate(user ? "/dashboard" : "/signup")}
                className="group inline-flex items-center gap-2 rounded-xl bg-primary-600 px-7 py-3.5 text-sm font-semibold text-white shadow-medium transition-all duration-300 hover:bg-primary-700 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                {user ? "Go to Dashboard" : "Get started free"}
                <ArrowRight size={15} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => navigate("/pricing")}
                className="inline-flex items-center gap-2 rounded-xl border border-default px-7 py-3.5 text-sm font-semibold text-primary transition-colors duration-300 hover:bg-card"
              >
                See pricing
              </button>
            </motion.div>

            {/* Trust pills */}
            <motion.div {...softFade(0.36)} className="mt-8 flex flex-wrap items-center gap-4">
              {TRUST.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-[11px] font-medium text-muted">
                  <Icon size={12} className="text-primary-500" />
                  {label}
                </div>
              ))}
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
                No credit card required
              </div>
            </motion.div>

            {/* Mobile pillar strip */}
            <motion.div {...softUp(0.42)} className="mt-10 grid grid-cols-2 gap-2.5 lg:hidden">
              {PILLARS.map(({ icon: Icon, label, bg, color }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease, delay: 0.46 + i * 0.06 }}
                  className={`flex items-center gap-3 rounded-xl border border-default ${bg} px-4 py-3.5`}
                >
                  <Icon size={18} className={`shrink-0 ${color}`} strokeWidth={2} />
                  <span className="text-sm font-semibold text-primary">{label}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile activity preview */}
            <motion.div {...softFade(0.52)} className="mt-4 overflow-hidden rounded-xl border border-default bg-card lg:hidden">
              <div className="flex items-center gap-1.5 border-b border-default bg-default/60 px-4 py-2.5">
                <div className="h-2 w-2 rounded-full bg-red-400/70" />
                <div className="h-2 w-2 rounded-full bg-yellow-400/70" />
                <div className="h-2 w-2 rounded-full bg-green-400/70" />
                <div className="ml-3 h-3 w-24 rounded bg-default" />
                <div className="ml-auto flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
                  <span className="text-[10px] text-muted">Synced</span>
                </div>
              </div>
              <div className="divide-y divide-[var(--color-border)]">
                {ACTIVITY.map((row, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, ease, delay: 0.56 + i * 0.08 }}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <div className={`h-2 w-2 shrink-0 rounded-full border ${row.dot} ${row.border}`} />
                    <span className="flex-1 text-xs text-muted">{row.text}</span>
                    <span className="text-[10px] tabular-nums text-muted/50">{row.time}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT — floating dashboard card */}
          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Gentle floating animation on the whole card stack */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
            >
              {/* Shadow card (back) */}
              <motion.div
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 1, rotate: 3.5 }}
                transition={{ duration: 0.8, ease, delay: 0.3 }}
                className="absolute inset-0 rounded-2xl border border-primary-500/20 bg-card shadow-hard"
                aria-hidden
              />

              {/* Middle card */}
              <motion.div
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 1, rotate: -1.5 }}
                transition={{ duration: 0.8, ease, delay: 0.25 }}
                className="absolute inset-0 rounded-2xl border border-default bg-card/80 shadow-medium backdrop-blur-sm"
                aria-hidden
              />

              {/* Front card */}
              <div className="relative overflow-hidden rounded-2xl border border-default bg-card shadow-hard ring-1 ring-primary-500/10">

                {/* Window chrome */}
                <div className="flex items-center gap-2 border-b border-default bg-default/60 px-5 py-3.5 backdrop-blur-sm">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                  <div className="ml-4 h-4 w-32 rounded-md bg-default" />
                  <div className="ml-auto h-4 w-16 rounded-md bg-default" />
                </div>

                <div className="p-6">
                  {/* Greeting */}
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted">Dashboard</p>
                      <p className="mt-1 text-lg font-bold tracking-tight text-primary">
                        Good morning, Alex 👋
                      </p>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                      A
                    </div>
                  </div>

                  {/* Pillar grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {PILLARS.map(({ icon: Icon, label, bg, color }, i) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease, delay: 0.5 + i * 0.07 }}
                        className={`flex items-center gap-3 rounded-xl border border-default ${bg} px-4 py-3.5`}
                      >
                        <Icon size={18} className={`shrink-0 ${color}`} strokeWidth={2} />
                        <span className="text-sm font-semibold text-primary">{label}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="my-4 border-t border-default" />

                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
                    Recent activity
                  </p>
                  <div className="space-y-2">
                    {ACTIVITY.map((row, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, ease, delay: 0.7 + i * 0.09 }}
                        className="flex items-center gap-3 rounded-lg border border-default bg-default px-3.5 py-3"
                      >
                        <div className={`h-2 w-2 shrink-0 rounded-full border ${row.dot} ${row.border}`} />
                        <span className="flex-1 text-xs text-muted">{row.text}</span>
                        <span className="text-[11px] tabular-nums text-muted/60">{row.time}</span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, ease, delay: 1.0 }}
                    className="mt-4 flex items-center gap-2 rounded-lg border border-default bg-default px-3.5 py-2.5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
                    <span className="text-xs font-medium text-muted">All changes synced</span>
                    <span className="ml-auto text-[11px] text-muted/50">just now</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
