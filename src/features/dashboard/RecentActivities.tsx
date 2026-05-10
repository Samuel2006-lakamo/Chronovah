import { useNavigate } from "react-router-dom";
import { useDashboard } from "../../hooks/useDashBoard";
import type { ActivityItem } from "../../type/DashboardType";
import { NotebookPen, MapPin, Users, BookOpen, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const TYPE_CONFIG: Record<
  ActivityItem["type"],
  { label: string; icon: React.ElementType; color: string; bg: string; route: string }
> = {
  notes:    { label: "Note",    icon: NotebookPen, color: "text-yellow-600 dark:text-yellow-400",  bg: "bg-yellow-500/10",  route: "/notes" },
  journals: { label: "Journal", icon: BookOpen,    color: "text-purple-600 dark:text-purple-400",  bg: "bg-purple-500/10",  route: "/journal" },
  places:   { label: "Place",   icon: MapPin,      color: "text-blue-600 dark:text-blue-400",      bg: "bg-blue-500/10",    route: "/places" },
  people:   { label: "Person",  icon: Users,       color: "text-green-600 dark:text-green-400",    bg: "bg-green-500/10",   route: "/people" },
};

function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function RecentActivities() {
  const { activities } = useDashboard();
  const navigate = useNavigate();

  return (
    <section aria-label="Recent activity">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h2 className="text-sm sm:text-base font-semibold text-primary">Recent Activity</h2>
      </div>

      <div className="bg-card border border-default rounded-xl overflow-hidden">
        {activities.length === 0 ? (
          <div className="px-3 sm:px-4 py-6 sm:py-10 text-center">
            <p className="text-xs sm:text-sm text-muted">No activity yet. Start by creating a note or journal entry.</p>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--color-border)]">
            {activities.map((item, i) => {
              const cfg = TYPE_CONFIG[item.type];
              const Icon = cfg.icon;
              const destination = `${cfg.route}/${item.id}`;

              return (
                <motion.li
                  key={`${item.type}-${item.id}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <button
                    onClick={() => navigate(destination)}
                    className="w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2.5 sm:py-3 hover:bg-default transition-colors text-left group"
                  >
                    {/* Icon badge */}
                    <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${cfg.bg}`}>
                      <Icon size={14} className={cfg.color} />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-primary truncate leading-snug">
                        {item.title || "Untitled"}
                      </p>
                      <p className="text-xs text-muted mt-0.5">{cfg.label}</p>
                    </div>

                    {/* Time + arrow */}
                    <div className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2">
                      <span className="text-xs text-muted tabular-nums hidden sm:inline">{timeAgo(item.createdAt)}</span>
                      <ArrowRight
                        size={14}
                        className="text-muted opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </button>
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

export default RecentActivities;
