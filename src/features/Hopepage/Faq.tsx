import { useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "What is Chronovah?",
    a: "Chronovah is an offline-first personal workspace for notes, places, people, and journal entries. Everything lives in one dashboard, works without internet, and syncs when you are back online.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. Data is stored locally on your device first using IndexedDB. We use AES-256 encryption and never have access to your personal information. You control what gets backed up.",
  },
  {
    q: "How does offline mode work?",
    a: "Chronovah is built offline-first with Dexie.js. You can view, edit, and create content with no internet connection. When you reconnect, everything syncs automatically in the background.",
  },
  {
    q: "Can I use it across multiple devices?",
    a: "Yes. Changes sync across all your devices when online. Work done offline is never lost — it queues and syncs when connectivity returns.",
  },
  {
    q: "What is included in the free plan?",
    a: "The free plan includes unlimited notes, up to 20 journal entries, 12 people, and 15 places — plus offline access and encryption. No time limit.",
  },
  {
    q: "Can I export my data?",
    a: "Always. Your data belongs to you. Export everything as JSON or Markdown at any time. No lock-in.",
  },
  {
    q: "Can I cancel my Pro subscription?",
    a: "Yes, cancel anytime with no penalties. You retain Pro access until the end of your billing period.",
  },
  {
    q: "Is payment secure?",
    a: "Payments are processed by Paystack, a PCI-DSS compliant payment provider. We never store your card details.",
  },
];

function Item({ item, open, onToggle }: { item: FaqItem; open: boolean; onToggle: () => void }) {
  return (
    <div
      className={`rounded-xl border bg-card transition-colors ${
        open ? "border-primary-500/30" : "border-default"
      }`}
    >
      <button
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span className="text-base font-semibold text-primary sm:text-lg">{item.q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
            open ? "bg-primary-500/10 text-primary-500" : "bg-default text-muted"
          }`}
        >
          <ChevronDown size={15} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-[0.9375rem] leading-relaxed text-muted sm:text-base">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const [open, setOpen] = useState<number | null>(0);

  const toggle = (i: number) => setOpen(open === i ? null : i);

  const half = Math.ceil(FAQS.length / 2);
  const left = FAQS.slice(0, half);
  const right = FAQS.slice(half);

  return (
    <section
      ref={ref}
      className="relative border-b border-default bg-card py-24 md:py-32"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14 max-w-xl"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
            FAQ
          </p>
          <h2
            id="faq-heading"
            className="font-display text-4xl font-normal tracking-tight text-primary sm:text-5xl"
          >
            Common questions
          </h2>
          <p className="mt-4 text-muted">
            Straight answers. If something is not covered, reach out below.
          </p>
        </motion.div>

        {/* Two-column accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid gap-3 lg:grid-cols-2 lg:gap-x-8"
        >
          <div className="space-y-3">
            {left.map((item, i) => (
              <Item
                key={i}
                item={item}
                open={open === i}
                onToggle={() => toggle(i)}
              />
            ))}
          </div>
          <div className="space-y-3">
            {right.map((item, i) => (
              <Item
                key={i + half}
                item={item}
                open={open === i + half}
                onToggle={() => toggle(i + half)}
              />
            ))}
          </div>
        </motion.div>

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 rounded-2xl border border-default bg-default p-8 text-center"
        >
          <p className="text-sm font-semibold text-primary">Still have questions?</p>
          <p className="mt-1 text-sm text-muted">
            Can not find the answer you are looking for? Reach out to our team.
          </p>
          <a
            href="mailto:support@chronovah.xyz"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Contact support
          </a>
        </motion.div>
      </div>
    </section>
  );
}
