import { motion, useInView } from "framer-motion";
import { MapPin, Users, NotebookPen, BookHeart, ArrowRight } from "lucide-react";
import { useRef, type JSX } from "react";
import { useNavigate } from "react-router-dom";

interface Pillar {
  title: string;
  tagline: string;
  description: string;
  icon: JSX.Element;
  benefits: string[];
  iconBg: string;
  accentText: string;
  accentBullet: string;
  route: string;
}

const PILLARS: Pillar[] = [
  {
    title: "Places",
    tagline: "Every location with context",
    description:
      "Log the places that matter — restaurants, cities, landmarks — with notes, photos, and tags. Browse your personal map of the world.",
    icon: <MapPin size={22} strokeWidth={1.75} />,
    benefits: ["Photos & notes per place", "Tags & search", "Offline access", "Visit dates"],
    iconBg: "bg-places-soft",
    accentText: "text-[var(--color-places-light)] dark:text-[var(--color-places-dark)]",
    accentBullet: "bg-[var(--color-places-light)] dark:bg-[var(--color-places-dark)]",
    route: "/places",
  },
  {
    title: "Notes",
    tagline: "Capture without switching apps",
    description:
      "Markdown-powered notes with pinning, tagging, and full-text search. Fast to open, fast to write, always available offline.",
    icon: <NotebookPen size={22} strokeWidth={1.75} />,
    benefits: ["Markdown support", "Pin & favorites", "Full-text search", "Color labels"],
    iconBg: "bg-notes-soft",
    accentText: "text-[var(--color-notes-light)] dark:text-[var(--color-notes-dark)]",
    accentBullet: "bg-[var(--color-notes-light)] dark:bg-[var(--color-notes-dark)]",
    route: "/notes",
  },
  {
    title: "People",
    tagline: "Contacts with real context",
    description:
      "Go beyond a name and number. Store roles, important dates, notes, and social links for everyone in your network.",
    icon: <Users size={22} strokeWidth={1.75} />,
    benefits: ["Roles & relationships", "Important dates", "Notes & photos", "Social links"],
    iconBg: "bg-people-soft",
    accentText: "text-[var(--color-people-light)] dark:text-[var(--color-people-dark)]",
    accentBullet: "bg-[var(--color-people-light)] dark:bg-[var(--color-people-dark)]",
    route: "/people",
  },
  {
    title: "Journal",
    tagline: "Reflection without friction",
    description:
      "Short daily entries with mood tracking. Private by default, searchable, and always in sync with the rest of your workspace.",
    icon: <BookHeart size={22} strokeWidth={1.75} />,
    benefits: ["Mood tracking", "Private by default", "Favorites", "Streak tracking"],
    iconBg: "bg-journal-soft",
    accentText: "text-[var(--color-journal-light)] dark:text-[var(--color-journal-dark)]",
    accentBullet: "bg-[var(--color-journal-light)] dark:bg-[var(--color-journal-dark)]",
    route: "/journal",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function Features() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const navigate = useNavigate();

  return (
    <section
      id="features"
      ref={ref}
      className="relative border-b border-default bg-default py-24 md:py-32"
      aria-labelledby="features-heading"
    >
      {/* Subtle dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(var(--color-border) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-16 max-w-2xl"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
            What's inside
          </p>
          <h2
            id="features-heading"
            className="font-display text-4xl font-normal tracking-tight text-primary sm:text-5xl md:text-[3.25rem]"
          >
            Four pillars.
            <br />
            <span className="text-primary-600 dark:text-primary-400">One workspace.</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Everything lives in the same place, shares the same search, and
            works without an internet connection.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {PILLARS.map((pillar) => (
            <motion.div
              key={pillar.title}
              variants={item}
              className="group relative flex flex-col rounded-2xl border border-default bg-card p-7 transition-all duration-500 hover:shadow-medium hover:-translate-y-1"
            >
              {/* Icon */}
              <div
                className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-default ${pillar.iconBg}`}
              >
                <span className={pillar.accentText}>{pillar.icon}</span>
              </div>

              <h3 className="mb-1 text-lg font-semibold text-primary">{pillar.title}</h3>
              <p className={`mb-3 text-sm font-medium ${pillar.accentText}`}>{pillar.tagline}</p>
              <p className="mb-5 text-[0.9375rem] leading-relaxed text-muted">{pillar.description}</p>

              {/* Benefits */}
              <ul className="mt-auto space-y-2">
                {pillar.benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2.5 text-sm text-muted">
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${pillar.accentBullet}`} />
                    {b}
                  </li>
                ))}
              </ul>

              {/* Hover arrow */}
              <div className="mt-5 flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                  onClick={() => navigate(pillar.route)}
                  className={`flex items-center gap-1 text-xs font-medium ${pillar.accentText}`}
                >
                  Explore <ArrowRight size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
