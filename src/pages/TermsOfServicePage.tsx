import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useSEO } from "../hooks/useSEO";

const LAST_UPDATED = "May 2, 2026";

const sections = [
  {
    title: "1. Acceptance of terms",
    body: `By creating an account or using Chronovah ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.`,
  },
  {
    title: "2. Description of service",
    body: `Chronovah is an offline-first personal workspace that lets you manage notes, places, people, and journal entries. The Service is provided "as is" and may change over time. We reserve the right to modify, suspend, or discontinue any part of the Service at any time.`,
  },
  {
    title: "3. Accounts",
    body: `You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your credentials and for all activity that occurs under your account. Notify us immediately at support@chronovah.xyz if you suspect unauthorised access.`,
  },
  {
    title: "4. Acceptable use",
    body: `You agree not to:

• Use the Service for any unlawful purpose.
• Attempt to gain unauthorised access to any part of the Service or its infrastructure.
• Reverse-engineer, decompile, or disassemble any part of the Service.
• Upload or transmit malicious code, spam, or content that infringes third-party rights.
• Resell or sublicense access to the Service without our written consent.`,
  },
  {
    title: "5. Intellectual property",
    body: `All content, design, code, and trademarks associated with Chronovah are owned by or licensed to us. You retain full ownership of the content you create within the Service. By using the Service you grant us a limited, non-exclusive licence to store and process your content solely to provide the Service to you.`,
  },
  {
    title: "6. Subscriptions and payments",
    body: `Paid plans are billed in advance on a monthly or annual basis. All payments are processed by Paystack. Prices are listed in USD and may be subject to local taxes.

Subscriptions renew automatically unless cancelled before the renewal date. You can manage or cancel your subscription from the Billing page in your account settings.`,
  },
  {
    title: "7. Refund policy",
    body: `All payments are final. We do not offer refunds for partial billing periods or unused subscription time. See our Refund Policy page for full details.`,
  },
  {
    title: "8. Termination",
    body: `We may suspend or terminate your account at our discretion if you violate these Terms. You may delete your account at any time from the Settings page. Upon termination, your right to use the Service ceases immediately.`,
  },
  {
    title: "9. Disclaimer of warranties",
    body: `The Service is provided "as is" without warranties of any kind, express or implied. We do not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components.`,
  },
  {
    title: "10. Limitation of liability",
    body: `To the maximum extent permitted by law, Chronovah and its team shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service, even if we have been advised of the possibility of such damages.`,
  },
  {
    title: "11. Governing law",
    body: `These Terms are governed by the laws of the Federal Republic of Nigeria, without regard to conflict-of-law principles.`,
  },
  {
    title: "12. Changes to these terms",
    body: `We may update these Terms from time to time. We will notify you of material changes via email or an in-app notice. Continued use of the Service after changes take effect constitutes acceptance of the updated Terms.`,
  },
  {
    title: "13. Contact",
    body: `Questions about these Terms? Email us at support@chronovah.xyz.`,
  },
];

export default function TermsOfServicePage() {
  useSEO({
    title: "Terms of Service — Chronovah Personal Workspace App",
    description:
      "Terms governing your use of Chronovah — the offline-first app to store notes, journal entries, people details, and places. Read before signing up.",
    canonical: "/terms",
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
                Terms of Service
              </h1>
              <p className="mt-4 text-sm text-muted">Last updated: {LAST_UPDATED}</p>
              <p className="mt-4 text-base leading-relaxed text-muted">
                Please read these terms carefully before using Chronovah. They govern your use of
                the Service and form a binding agreement between you and us.
              </p>
            </motion.div>
          </div>
        </section>

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
