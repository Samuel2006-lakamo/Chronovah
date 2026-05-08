import { useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { protectedAxios } from "../../../axios";
import { useAuth } from "../../hooks/useAuth";

export default function NotificationSettings() {
  const { user, refresh } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  // Default to true if not yet loaded from server
  const remindersEnabled = user?.emailReminders ?? true;

  const toggleReminders = async (enabled: boolean) => {
    setIsUpdating(true);
    try {
      await protectedAxios.post("/reminders/toggle", { enabled });
      // Refresh user so the toggle reflects the saved state
      await refresh();
    } catch {
      // Silently revert — refresh will restore the correct server state
      await refresh();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-default rounded-2xl p-4 sm:p-5 lg:p-6 shadow space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold text-primary">
        Notifications
      </h2>

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-0.5 p-2 rounded-lg bg-primary-500/10 flex-shrink-0">
            {remindersEnabled ? (
              <Bell size={16} className="text-primary-500" />
            ) : (
              <BellOff size={16} className="text-muted" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-primary">Daily email reminder</p>
            <p className="text-xs text-muted mt-0.5 leading-relaxed">
              Receive a daily reminder at 8am to update your journal, people and places.
            </p>
          </div>
        </div>

        {/* Toggle */}
        <button
          onClick={() => toggleReminders(!remindersEnabled)}
          disabled={isUpdating}
          aria-label={remindersEnabled ? "Disable daily reminders" : "Enable daily reminders"}
          className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${
            remindersEnabled ? "bg-primary-500" : "bg-default border border-default"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
              remindersEnabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
