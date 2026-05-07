import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Box,
  ShieldCheck,
  WifiOff,
  Clock,
  Users,
  BookHeart,
  MapPin,
  NotebookPen,
  ArrowRight,
} from "lucide-react";
import { useSEO } from "../hooks/useSEO";

const PILLARS = [
  {
    icon: NotebookPen,
    label: "Notes",
    desc: "Capture thoughts, ideas, and reminders in a fast, distraction-free editor.",
    bg: "bg-notes-soft",
    color: "text-[var(--color-notes-light)]",
  },
  {
    icon: MapPin,
    label: "Places",
    desc: "Save and revisit the locations that matter — with context and memories attached.",
    bg: "bg-places-soft",
    color: "text-[var(--color-places-light)]",
  },
  {
    icon: Users,
    label: "People",
    desc: "Keep track of the people in your life, their details, and your shared history.",
    bg: "bg-people-soft",
    color: "text-[var(--color-people-light)]",
  },
  {
    icon: BookHeart,
    label: "Journal",
    desc: "A private space for daily reflection, gratitude, and long-form writing.",
    bg: "bg-journal-soft",
    color: "text-[var(--color-journal-light)]",
  },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Privacy first",
    desc: "Your data lives on your device. We don't sell it, mine it, or share it with anyone.",
  },
  {
    icon: WifiOff,
    title: "Offline by default",
    desc: "Everything works without an internet connection. Sync happens when you're ready.",
  },
  {
    icon: Clock,
    title: "Built to last",
    desc: "Simple, focused tools that stay out of your way and stand the test of time.",
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

export default function AboutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useSEO({
    title: "About — One Workspace for Everything That Matters",
    description:
      "Learn why we built Chronovah — an offline-first, privacy-focused personal workspace for notes, journal, people, and places.",
    canonical: "/about",
  });

  return (
    <>
      <Header />
      <main className="">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden border-b border-default bg-default py-24 md:py-32">
          <div
            className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-primary-500/[0.06] blur-[120px]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-8">
            <motion.div {...fadeUp(0)}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/[0.07] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-primary-700 dark:text-primary-300">
                <Box size={12} />
                About Chronovah
              </div>
              <h1 className="font-display text-4xl font-normal leading-tight tracking-tight text-primary sm:text-5xl md:text-[3.25rem]">
                One workspace for{" "}
                <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent dark:from-primary-400 dark:to-primary-300">
                  everything that matters
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
                Chronovah is an offline-first personal workspace that brings your notes, places,
                people, and journal into one private, fast, and structured environment.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Story ── */}
        <section className="border-b border-default bg-card py-20">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <motion.div {...fadeUp(0)}>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
                Our story
              </p>
              <h2 className="mb-6 font-display text-3xl font-normal tracking-tight text-primary">
                Why we built this
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-muted">
                <p>
                  We kept switching between a dozen apps — one for notes, another for contacts,
                  a third for journaling, and a map app for saved places. Every tool had its own
                  sync, its own subscription, and its own way of locking your data in.
                </p>
                <p>
                  Chronovah started as a personal project to fix that. One place, one data model,
                  one experience — offline by default, private by design, and fast enough to get
                  out of your way.
                </p>
                <p>
                  We're still early. But the foundation is solid, and we're building in public
                  with the people who use it every day.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Pillars ── */}
        <section className="border-b border-default bg-default py-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <motion.div {...fadeUp(0)} className="mb-12 text-center">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
                What's inside
              </p>
              <h2 className="font-display text-3xl font-normal tracking-tight text-primary">
                Four pillars, one workspace
              </h2>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2">
              {PILLARS.map(({ icon: Icon, label, desc, bg, color }, i) => (
                <motion.div
                  key={label}
                  {...fadeUp(i * 0.08)}
                  className={`rounded-2xl border border-default ${bg} p-6`}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <Icon size={20} className={color} strokeWidth={2} />
                    <span className="font-semibold text-primary">{label}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="border-b border-default bg-card py-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <motion.div {...fadeUp(0)} className="mb-12 text-center">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
                Our values
              </p>
              <h2 className="font-display text-3xl font-normal tracking-tight text-primary">
                What we stand for
              </h2>
            </motion.div>
            <div className="grid gap-6 sm:grid-cols-3">
              {VALUES.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  {...fadeUp(i * 0.1)}
                  className="rounded-2xl border border-default bg-default p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10">
                    <Icon size={20} className="text-primary-500" />
                  </div>
                  <h3 className="mb-2 font-semibold text-primary">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-default py-20">
          <div className="mx-auto max-w-2xl px-6 text-center lg:px-8">
            <motion.div {...fadeUp(0)}>
              <h2 className="font-display text-3xl font-normal tracking-tight text-primary">
                Ready to get started?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted">
                Free plan available forever. No credit card required.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => navigate(user ? "/dashboard" : "/signup")}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-7 py-3.5 text-sm font-semibold text-white shadow-medium transition-colors hover:bg-primary-700"
                >
                  {user ? "Go to Dashboard" : "Start for free"}
                  <ArrowRight size={15} strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => navigate("/pricing")}
                  className="inline-flex items-center gap-2 rounded-xl border border-default px-7 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-card"
                >
                  View pricing
                </button>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
