import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, MessageSquare, Clock, ArrowRight, CheckCircle } from "lucide-react";
import { useSEO } from "../hooks/useSEO";

const TOPICS = [
  "General question",
  "Bug report",
  "Feature request",
  "Billing / subscription",
  "Account issue",
  "Other",
];

const INFO = [
  {
    icon: Mail,
    title: "Email us",
    desc: "We read every message and reply within 2 business days.",
    value: "support@chronovah.com",
    href: "mailto:support@chronovah.com",
  },
  {
    icon: Clock,
    title: "Response time",
    desc: "Monday – Friday, 9 am – 6 pm WAT.",
    value: "Within 2 business days",
    href: null,
  },
  {
    icon: MessageSquare,
    title: "Feedback",
    desc: "Have an idea or spotted something off? We want to hear it.",
    value: "feedback@chronovah.com",
    href: "mailto:feedback@chronovah.com",
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.45, delay },
});

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useSEO({
    title: "Contact Us",
    description:
      "Have a question, bug report, or feature request? Get in touch with the Chronovah team — we reply within 2 business days.",
    canonical: "/contact",
  });

  const isValid = name.trim() && email.trim() && message.trim().length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    // Simulate a short delay — replace with a real API call when ready
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <>
      <Header />
      <main className="">

        {/* ── Hero ── */}
        <section className="border-b border-default bg-default py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
            <motion.div {...fadeUp(0)}>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
                Get in touch
              </p>
              <h1 className="font-display text-4xl font-normal tracking-tight text-primary sm:text-5xl">
                We'd love to hear from you
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
                Whether it's a question, a bug, or just feedback — drop us a message and we'll
                get back to you as soon as we can.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Info cards ── */}
        <section className="border-b border-default bg-card py-14">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <div className="grid gap-4 sm:grid-cols-3">
              {INFO.map(({ icon: Icon, title, desc, value, href }, i) => (
                <motion.div
                  key={title}
                  {...fadeUp(i * 0.08)}
                  className="rounded-2xl border border-default bg-default p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10">
                    <Icon size={18} className="text-primary-500" />
                  </div>
                  <h3 className="mb-1 font-semibold text-primary">{title}</h3>
                  <p className="mb-3 text-sm leading-relaxed text-muted">{desc}</p>
                  {href ? (
                    <a
                      href={href}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      {value}
                    </a>
                  ) : (
                    <span className="text-sm font-medium text-primary">{value}</span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Form ── */}
        <section className="bg-default py-16">
          <div className="mx-auto max-w-2xl px-6 lg:px-8">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border border-default bg-card p-10 text-center"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent-green/10">
                  <CheckCircle size={28} className="text-accent-green" />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-primary">Message sent!</h2>
                <p className="text-sm leading-relaxed text-muted">
                  Thanks for reaching out. We'll get back to you at{" "}
                  <span className="font-medium text-primary">{email}</span> within 2 business days.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName("");
                    setEmail("");
                    setMessage("");
                    setTopic(TOPICS[0]);
                  }}
                  className="mt-6 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <motion.div {...fadeUp(0)}>
                <h2 className="mb-8 font-display text-2xl font-normal tracking-tight text-primary">
                  Send us a message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name + Email row */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-primary">
                        Your name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Johnson"
                        required
                        className="w-full rounded-xl border border-default bg-card px-4 py-3 text-sm text-primary placeholder:text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-primary">
                        Email address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full rounded-xl border border-default bg-card px-4 py-3 text-sm text-primary placeholder:text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Topic */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-primary">
                      Topic
                    </label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full rounded-xl border border-default bg-card px-4 py-3 text-sm text-primary focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
                    >
                      {TOPICS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-primary">
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what's on your mind..."
                      required
                      rows={6}
                      className="w-full resize-none rounded-xl border border-default bg-card px-4 py-3 text-sm text-primary placeholder:text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
                    />
                    <p className="mt-1 text-right text-xs text-muted">
                      {message.length} / 1000
                    </p>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={!isValid || loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-sm font-semibold text-white shadow-medium transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send message
                        <ArrowRight size={15} strokeWidth={2.5} />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-muted">
                    By submitting this form you agree to our{" "}
                    <a href="/privacy" className="text-primary-600 hover:underline dark:text-primary-400">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </form>
              </motion.div>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
