/**
 * useInstallPrompt.ts
 *
 * Captures the browser's native "Add to Home Screen" / PWA install prompt.
 *
 * HOW IT WORKS:
 * The browser fires a `beforeinstallprompt` event when it decides the app
 * meets the PWA installability criteria (HTTPS, valid manifest, service worker,
 * not already installed). We intercept that event and hold onto it — the browser
 * won't show its own prompt automatically. We then show our own custom banner
 * and call `prompt()` on the saved event when the user clicks "Install".
 *
 * SAFARI NOTE:
 * Safari on iOS does NOT fire `beforeinstallprompt`. It uses its own "Add to
 * Home Screen" flow via the Share menu. We detect Safari separately and show
 * a manual instruction banner instead.
 *
 * USAGE:
 *   const { canInstall, isIosSafari, triggerInstall, dismiss } = useInstallPrompt();
 */

import { useState, useEffect, useCallback } from "react";

// Extend the Window type to include the non-standard beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

interface UseInstallPromptReturn {
  /** True when the browser has a pending install prompt (Chrome/Android/Edge) */
  canInstall: boolean;
  /** True when running on iOS Safari — needs manual "Add to Home Screen" instructions */
  isIosSafari: boolean;
  /** True when the app is already running as an installed PWA */
  isInstalled: boolean;
  /** True when the user has dismissed the prompt this session */
  isDismissed: boolean;
  /** Call this to trigger the native install dialog */
  triggerInstall: () => Promise<void>;
  /** Call this to hide the install banner for this session */
  dismiss: () => void;
}

function detectIosSafari(): boolean {
  const ua = navigator.userAgent;
  const isIos = /iphone|ipad|ipod/i.test(ua);
  // Safari on iOS doesn't have "Chrome" or "CriOS" in the UA
  const isSafari = /safari/i.test(ua) && !/chrome|crios|fxios/i.test(ua);
  return isIos && isSafari;
}

function detectInstalled(): boolean {
  // `display-mode: standalone` means the app was launched from the home screen
  return window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari sets this when running as a saved web app
    (navigator as any).standalone === true;
}

export function useInstallPrompt(): UseInstallPromptReturn {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(detectInstalled);

  const isIosSafari = detectIosSafari();
  const canInstall = deferredPrompt !== null && !isInstalled && !isDismissed;

  useEffect(() => {
    // If already installed, nothing to do
    if (isInstalled) return;

    const handler = (e: Event) => {
      // Prevent the browser from showing its own mini-infobar
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Listen for the app being installed (e.g. via browser menu)
    const installedHandler = () => setIsInstalled(true);
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, [isInstalled]);

  const triggerInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    // Show the native browser install dialog
    await deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }

    // The prompt can only be used once — clear it
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    setIsDismissed(true);
    setDeferredPrompt(null);
  }, []);

  return {
    canInstall,
    isIosSafari: isIosSafari && !isInstalled,
    isInstalled,
    isDismissed,
    triggerInstall,
    dismiss,
  };
}
