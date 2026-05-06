import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles } from 'lucide-react';
import { useSubscriptionStore } from '../../store/subscriptionStore';

const UpgradeNudge: React.FC = () => {
  const navigate = useNavigate();
  const { isProActive } = useSubscriptionStore();

  // Show once per day — store the last dismissed date, not a permanent flag
  const STORAGE_KEY = 'upgrade_nudge_last_dismissed';
  const lastDismissed = localStorage.getItem(STORAGE_KEY);
  const dismissedToday = lastDismissed
    ? new Date(lastDismissed).toDateString() === new Date().toDateString()
    : false;

  const [isDismissed, setIsDismissed] = useState(dismissedToday);

  if (isProActive || isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
  };

  return (
    <div className="mt-12 p-5 bg-primary-100/30 dark:bg-primary-950/30 border-l-4 border-primary-600 rounded-lg relative">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 hover:bg-primary-200/50 dark:hover:bg-primary-800/50 rounded-lg transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4 text-primary-600" />
      </button>

      <div className="flex items-start gap-3 pr-8">
        <Sparkles className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-primary dark:text-primary-200 font-medium mb-2">
            Loving Chronovah? Unlock Journal, People & Places with Pro.
          </p>
          <button
            onClick={() => navigate('/pricing')}
            className="text-primary-600 hover:text-primary-700 dark:hover:text-primary-400 font-semibold text-sm inline-flex items-center gap-1"
          >
            See Plans →
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeNudge;
