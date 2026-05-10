import { motion, useInView } from "framer-motion";
import { UserPlus, LayoutDashboard, WifiOff, ShieldCheck } from "lucide-react";
import { useRef, type JSX } from "react";

interface Step {
  number: string;
  title: string;
  description: string;
  icon: JSX.Element;
  details: string[];
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Create your account",
    description: "Sign up in seconds. No credit card, no onboarding wizard.",
    icon: <UserPlus size={20} strokeWidth={1.75} />,
    details: [
      "Free plan available immediately",
      "Works on any modern browser",
      "No app install required",
    ],
  },
  {
    number: "02",
    title: "Add what matters",
    description:
      "Start with a note, a place, a person, or a journal entry — in any order.",
    icon: <LayoutDashboard size={20} strokeWidth={1.75} />,
    details: [
      "All four sections from day one",
      "Tags and search across everything",
      "Photos and text together",
    ],
  },
  {
    number: "03",
    title: "Use it anywhere",
    description:
      "Read and edit with no connection. Sync runs automatically when you are back online.",
    icon: <WifiOff size={20} strokeWidth={1.75} />,
    details: [
      "Offline-first via IndexedDB",
      "Auto-sync on reconnect",
      "No mandatory always-online mode",
    ],
  },
  {
    number: "04",
    title: "Stay in control",
    description:
      "Your device is the source of truth. Export whenever you want.",
    icon: <ShieldCheck size={20} strokeWidth={1.75} />,
    details: [
      "Data stored locally first",
      "Export as JSON or Markdown",
      "No ads in the product UI",
    ],
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="relative border-b border-default bg-card py-24 md:py-32"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
            How it works
          </p>
          <h2
            id="how-heading"
            className="font-display text-4xl font-normal tracking-tight text-primary sm:text-5xl"
          >
            From zero to organized
            <br />
            <span className="text-primary-600 dark:text-primary-400">in four steps</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
            No gamified onboarding. No tutorial videos. Just a structure that
            matches how you already think.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connector line — desktop only */}
          <div
            className="pointer-events-none absolute top-10 left-[12.5%] hidden h-px w-3/4 border-t border-dashed border-default lg:block"
            aria-hidden
          />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 + i * 0.1 }}
              className="relative flex flex-col rounded-2xl border border-default bg-default p-7"
            >
              {/* Step number badge */}
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                  {step.number}
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-default bg-card text-primary-600">
                  {step.icon}
                </div>
              </div>

              <h3 className="mb-2 text-lg font-semibold text-primary">{step.title}</h3>
              <p className="mb-5 text-[0.9375rem] leading-relaxed text-muted">{step.description}</p>

              <ul className="mt-auto space-y-2">
                {step.details.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-muted">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary-500" />
                    {d}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
