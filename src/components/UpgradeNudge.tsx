import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Zap } from 'lucide-react';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useAuth } from '../hooks/useAuth';
import { db } from '../database/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'upgrade_nudge_last_dismissed';
// Show nudge once per day
const NUDGE_INTERVAL_MS = 24 * 60 * 60 * 1000;
// Delay before showing after page load (ms)
const SHOW_DELAY_MS = 8000;

const UpgradeNudge: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isProActive } = useSubscriptionStore();
  const [visible, setVisible] = useState(false);

  const journalCount = useLiveQuery(
    async () => (user ? db.journal.where('userId').equals(user.id).count() : 0),
    [user?.id]
  ) ?? 0;
  const peopleCount = useLiveQuery(
    async () => (user ? db.people.where('userId').equals(user.id).count() : 0),
    [user?.id]
  ) ?? 0;
  const placesCount = useLiveQuery(
    async () => (user ? db.places.where('userId').equals(user.id).count() : 0),
    [user?.id]
  ) ?? 0;

  useEffect(() => {
    if (isProActive || !user) return;

    // Check if dismissed within the interval
    const lastDismissed = localStorage.getItem(STORAGE_KEY);
    if (lastDismissed) {
      const elapsed = Date.now() - new Date(lastDismissed).getTime();
      if (elapsed < NUDGE_INTERVAL_MS) return;
    }

    // Show after a delay so it doesn't pop up immediately on load
    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isProActive, user]);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
  };

  if (isProActive || !user) return null;

  // Build a contextual message based on usage
  const limits = { journal: 20, people: 12, places: 15 };
  const nearLimit =
    journalCount >= limits.journal * 0.7 ||
    peopleCount >= limits.people * 0.7 ||
    placesCount >= limits.places * 0.7;

  const message = nearLimit
    ? "You're approaching your free limits. Upgrade to Pro for unlimited access."
    : "Unlock unlimited Journal, People & Places with Chronovah Pro.";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-40"
        >
          <div
            className="rounded-2xl border-2 p-4 shadow-hard flex items-start gap-3"
            style={{
              backgroundColor: 'var(--color-card)',
              borderColor: 'var(--color-primary)',
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'var(--color-primary)', opacity: 0.9 }}
            >
              <Zap className="w-4 h-4 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-primary leading-snug">
                {message}
              </p>
              <button
                onClick={() => { navigate('/upgrade'); handleDismiss(); }}
                className="mt-2 text-xs font-bold text-primary-600 dark:text-primary-400 hover:opacity-80 transition-opacity"
              >
                Upgrade to Pro →
              </button>
            </div>

            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg hover:bg-default transition-colors shrink-0"
              aria-label="Dismiss"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpgradeNudge;
