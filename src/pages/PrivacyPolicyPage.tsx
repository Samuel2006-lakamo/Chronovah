import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useSEO } from "../hooks/useSEO";

const LAST_UPDATED = "May 2, 2026";

const sections = [
  {
    title: "1. Information we collect",
    body: `Chronovah is designed to store your data locally on your device using IndexedDB (via Dexie.js). We collect minimal information necessary to operate the service:

• Account information: your name, email address, and hashed password when you register.
• Usage data: basic, anonymised analytics such as feature usage counts — never the content of your notes, journal entries, places, or people.
• Payment data: billing is handled by Paystack. We do not store your card details.`,
  },
  {
    title: "2. How we use your information",
    body: `We use the information we collect to:

• Provide, maintain, and improve the Chronovah service.
• Send transactional emails (account verification, password reset).
• Respond to support requests.
• Detect and prevent fraud or abuse.

We do not sell, rent, or share your personal information with third parties for marketing purposes.`,
  },
  {
    title: "3. Data storage and security",
    body: `Your personal workspace data (notes, journal, places, people) is stored locally on your device and is never uploaded to our servers unless you explicitly enable cloud sync. We use industry-standard encryption (TLS) for all data in transit and at rest on our servers.`,
  },
  {
    title: "4. Cookies",
    body: `We use a minimal set of cookies strictly necessary to keep you signed in and to protect against cross-site request forgery. We do not use advertising or tracking cookies.`,
  },
  {
    title: "5. Third-party services",
    body: `We use the following third-party services:

• Paystack — payment processing. Subject to Paystack's privacy policy.
• Render / Railway — server hosting. Your account data resides on their infrastructure.

We are not responsible for the privacy practices of these services.`,
  },
  {
    title: "6. Your rights",
    body: `You have the right to:

• Access the personal data we hold about you.
• Request correction of inaccurate data.
• Request deletion of your account and associated data.
• Export your data at any time from the Settings page.

To exercise any of these rights, email us at support@chronovah.com.`,
  },
  {
    title: "7. Children's privacy",
    body: `Chronovah is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.`,
  },
  {
    title: "8. Changes to this policy",
    body: `We may update this Privacy Policy from time to time. We will notify you of significant changes by email or via an in-app notice. Continued use of the service after changes take effect constitutes acceptance of the updated policy.`,
  },
  {
    title: "9. Contact",
    body: `Questions about this policy? Email us at support@chronovah.com.`,
  },
];

export default function PrivacyPolicyPage() {
  useSEO({
    title: "Privacy Policy",
    description:
      "Chronovah stores your data locally on your device. Read how we handle your information, what we collect, and your rights.",
    canonical: "/privacy",
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
                Privacy Policy
              </h1>
              <p className="mt-4 text-sm text-muted">Last updated: {LAST_UPDATED}</p>
              <p className="mt-4 text-base leading-relaxed text-muted">
                Your privacy matters to us. This policy explains what data we collect, how we use
                it, and the choices you have.
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
