import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useSEO } from "../hooks/useSEO";

const LAST_UPDATED = "May 2, 2026";

const sections = [
  {
    title: "1. No-refund policy",
    body: `All payments made to Chronovah are final and non-refundable. This applies to:

• Monthly subscription payments.
• Annual subscription payments.
• Any one-time upgrade or add-on purchases.

We do not issue refunds for partial billing periods, unused subscription time, or accidental purchases.`,
  },
  {
    title: "2. Cancellations",
    body: `You may cancel your subscription at any time from the Billing page in your account settings. Cancellation takes effect at the end of your current billing period. You will retain access to paid features until that date.

Cancelling your subscription does not entitle you to a refund for the current or any previous billing period.`,
  },
  {
    title: "3. Exceptions",
    body: `We may, at our sole discretion, issue a refund or credit in exceptional circumstances — for example, if you were charged in error due to a technical fault on our side. To request a review, email support@chronovah.xyz within 7 days of the charge with your account email and a description of the issue.

We are not obligated to grant any exception and will evaluate each case individually.`,
  },
  {
    title: "4. Chargebacks",
    body: `If you initiate a chargeback with your bank or card provider without first contacting us, we reserve the right to suspend or terminate your account pending resolution of the dispute.`,
  },
  {
    title: "5. Free plan",
    body: `Chronovah offers a free plan with no payment required. If you are on the free plan, this policy does not apply to you.`,
  },
  {
    title: "6. Changes to this policy",
    body: `We may update this Refund Policy from time to time. Changes will be posted on this page with an updated date. Continued use of the Service after changes take effect constitutes acceptance of the updated policy.`,
  },
  {
    title: "7. Contact",
    body: `Questions about a charge or this policy? Email us at support@chronovah.xyz and we'll get back to you within 2 business days.`,
  },
];

export default function RefundPolicyPage() {
  const navigate = useNavigate();

  useSEO({
    title: "Refund Policy — Chronovah Subscription",
    description:
      "All Chronovah subscription payments are final. Understand cancellations, exceptions, and how billing works for our offline-first notes, journal, people, and places app.",
    canonical: "/refund",
  });

  return (
    <>
      <Header />
      <main className="">

        {/* Header */}
        <section className="border-b border-default bg-default py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
                Legal
              </p>
              <h1 className="font-display text-4xl font-normal tracking-tight text-primary sm:text-5xl">
                Refund Policy
              </h1>
              <p className="mt-4 text-sm text-muted">Last updated: {LAST_UPDATED}</p>
            </motion.div>
          </div>
        </section>

        {/* Banner */}
        <div className="border-b border-default bg-card">
          <div className="mx-auto max-w-3xl px-6 py-5 lg:px-8">
            <div className="flex items-start gap-3 rounded-xl border border-accent-red/20 bg-accent-red/5 p-4">
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-accent-red" />
              <p className="text-sm leading-relaxed text-muted">
                <span className="font-semibold text-primary">All payments are final.</span>{" "}
                We do not offer refunds for any subscription payments. Please review our pricing
                carefully before subscribing.{" "}
                <button
                  onClick={() => navigate("/pricing")}
                  className="font-medium text-primary-600 underline underline-offset-2 hover:text-primary-700 dark:text-primary-400"
                >
                  View pricing
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <section className="bg-default py-16">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <div className="space-y-10">
              {sections.map(({ title, body }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                >
                  <h2 className="mb-3 text-lg font-semibold text-primary">{title}</h2>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-muted">{body}</p>
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
