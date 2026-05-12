import { useState } from "react";
import SettingsSubPageLayout from "../../components/SettingsSubPageLayout";
import { Mail, MessageSquare, Copy, Send, CheckCircle } from "lucide-react";
import { SUPPORT_EMAIL, FEEDBACK_EMAIL } from "../../lib/constants";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../../components/Toast";
import { useAuth } from "../../hooks/useAuth";
import { protectedAxios } from "../../../axios";

export default function HelpSupportPage() {
  const { user } = useAuth();
  const { toasts, removeToast, success, error } = useToast();
  const [subject, setSubject] = useState("General Question");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    success(`Copied ${email} to clipboard`);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleOpenMailClient = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleSubmitContactForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || message.length < 20) {
      error("Message must be at least 20 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await protectedAxios.post("/support/contact", {
        subject,
        message,
      });
const responseData = response.statusText;

      if (responseData === "OK") {
        success(
          `Message sent. We will get back to you at ${user?.email} within 24 hours.`,
        );
        setMessage("");
        setSubject("General Question");
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        error(
          "Failed to send message. Please email us directly at support@chronovah.xyz",
        );
      }
    } catch (err) {
      console.error("Error sending message:", err);
      error("Failed to send message. Please email us directly at support@chronovah.xyz");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SettingsSubPageLayout
      title="Help & Support"
      description="Get in touch with us or send us feedback."
    >
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Email Addresses Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-primary">Contact Us</h3>

        {/* Support Email Card */}
        <div className="bg-card border border-default rounded-xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0">
                <Mail size={18} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-primary mb-1">
                  Report Issues & General Support
                </h4>
                <p className="text-xs text-muted mb-2">
                  We reply within 2 business days
                </p>
                <p className="text-sm font-mono text-primary-600 dark:text-primary-400">
                  {SUPPORT_EMAIL}
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => handleCopyEmail(SUPPORT_EMAIL)}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-default hover:bg-slate-100 border border-default transition-colors dark:hover:bg-slate-700"
                title="Copy email"
              >
                {copiedEmail === SUPPORT_EMAIL ? (
                  <CheckCircle size={16} className="text-accent-green" />
                ) : (
                  <Copy size={16} className="text-muted" />
                )}
              </button>
              <button
                onClick={() => handleOpenMailClient(SUPPORT_EMAIL)}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-default hover:bg-slate-100 border border-default transition-colors dark:hover:bg-slate-700"
                title="Open email client"
              >
                <Mail size={16} className="text-primary-600 dark:text-primary-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Feedback Email Card */}
        <div className="bg-card border border-default rounded-xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0">
                <MessageSquare size={18} className="text-teal-600 dark:text-teal-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-primary mb-1">
                  Share Feedback & Ideas
                </h4>
                <p className="text-xs text-muted mb-2">
                  Help us make Chronovah better
                </p>
                <p className="text-sm font-mono text-teal-600 dark:text-teal-400">
                  {FEEDBACK_EMAIL}
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => handleCopyEmail(FEEDBACK_EMAIL)}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-default hover:bg-slate-100 border border-default transition-colors dark:hover:bg-slate-700"
                title="Copy email"
              >
                {copiedEmail === FEEDBACK_EMAIL ? (
                  <CheckCircle size={16} className="text-accent-green" />
                ) : (
                  <Copy size={16} className="text-muted" />
                )}
              </button>
              <button
                onClick={() => handleOpenMailClient(FEEDBACK_EMAIL)}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-default hover:bg-slate-100 border border-default transition-colors dark:hover:bg-slate-700"
                title="Open email client"
              >
                <Mail size={16} className="text-teal-600 dark:text-teal-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="py-4">
        <div className="h-px bg-default"></div>
      </div>

      {/* Contact Form Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-primary">Send us a message</h3>

        {submitted ? (
          <div className="bg-accent-green/10 border border-accent-green/30 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle size={20} className="text-accent-green" />
            </div>
            <p className="text-sm font-semibold text-primary mb-1">Message sent!</p>
            <p className="text-xs text-muted">
              We will get back to you at {user?.email} within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitContactForm} className="space-y-4">
            {/* Subject selector */}
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-default bg-card text-sm text-primary placeholder:text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
              >
                <option value="General Question">General Question</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Account Issue">Account Issue</option>
                <option value="Billing">Billing</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Message textarea */}
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what's on your mind..."
                minLength={20}
                rows={5}
                className="w-full px-3 py-2.5 rounded-lg border border-default bg-card text-sm text-primary placeholder:text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors resize-none"
              />
              <p className="mt-1 text-right text-xs text-muted">
                {message.length} / 1000 chars
              </p>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting || message.length < 20}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary-600 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <Send size={16} />
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* FAQ Link */}
      <div className="py-4">
        <div className="h-px bg-default"></div>
      </div>

      <div className="bg-default rounded-xl p-4 text-center">
        <p className="text-xs text-muted mb-3">Need more help?</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
        >
          View Frequently Asked Questions
        </a>
      </div>
    </SettingsSubPageLayout>
  );
}
