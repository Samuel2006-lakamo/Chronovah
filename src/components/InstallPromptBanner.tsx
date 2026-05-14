/**
 * InstallPromptBanner.tsx
 *
 * Shows a bottom banner prompting the user to install Chronovah as a PWA.
 *
 * - Chrome / Android / Edge: shows a native install button
 * - iOS Safari: shows step-by-step instructions (tap Share → Add to Home Screen)
 *   because Safari doesn't support the beforeinstallprompt API
 * - Already installed or dismissed: renders nothing
 */

import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Share, Plus } from "lucide-react";
import { useInstallPrompt } from "../hooks/useInstallPrompt";

export default function InstallPromptBanner() {
  const { canInstall, isIosSafari, isInstalled, isDismissed, triggerInstall, dismiss } =
    useInstallPrompt();

  // Don't render if already installed, dismissed, or neither condition applies
  const shouldShow = (canInstall || isIosSafari) && !isInstalled && !isDismissed;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm"
          role="dialog"
          aria-label="Install Chronovah"
        >
          <div className="rounded-2xl border border-default bg-card shadow-medium p-4">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                {/* App icon */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600">
                  <span className="text-lg font-bold text-white">C</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">
                    Install Chronovah
                  </p>
                  <p className="text-xs text-muted">
                    Add to your home screen for the best experience
                  </p>
                </div>
              </div>
              <button
                onClick={dismiss}
                className="shrink-0 p-1 rounded-lg text-muted hover:text-primary hover:bg-default transition-colors"
                aria-label="Dismiss install prompt"
              >
                <X size={16} />
              </button>
            </div>

            {/* iOS Safari — manual instructions */}
            {isIosSafari && (
              <div className="space-y-2 mb-3">
                <p className="text-xs text-muted font-medium">To install on iPhone / iPad:</p>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-500/10">
                    <span className="text-[10px] font-bold text-primary-500">1</span>
                  </div>
                  <span>Tap the</span>
                  <Share size={13} className="text-primary-500 shrink-0" />
                  <span className="font-medium text-primary">Share</span>
                  <span>button in Safari</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-500/10">
                    <span className="text-[10px] font-bold text-primary-500">2</span>
                  </div>
                  <span>Scroll down and tap</span>
                  <Plus size={13} className="text-primary-500 shrink-0" />
                  <span className="font-medium text-primary">Add to Home Screen</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-500/10">
                    <span className="text-[10px] font-bold text-primary-500">3</span>
                  </div>
                  <span>Tap</span>
                  <span className="font-medium text-primary">Add</span>
                  <span>in the top right</span>
                </div>
              </div>
            )}

            {/* Chrome / Android / Edge — native install button */}
            {canInstall && (
              <button
                onClick={triggerInstall}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
              >
                <Download size={15} />
                Install App
              </button>
            )}

            {/* Dismiss link */}
            <button
              onClick={dismiss}
              className="mt-2 w-full text-center text-xs text-muted hover:text-primary transition-colors"
            >
              Not now
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
