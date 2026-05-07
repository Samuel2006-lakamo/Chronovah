import { motion } from "framer-motion";
import { BookOpen, Heart, Calendar, Flame } from "lucide-react";
import type { JournalStats } from "../../type/JournalType";

interface JournalStatsProps {
  stats: JournalStats;
}

export default function JournalStats({ stats }: JournalStatsProps) {
  const statCards = [
    { label: "Total",     value: stats.totalEntries,    icon: BookOpen, iconClass: "text-primary-500",   bgClass: "bg-primary-500/10",   suffix: "" },
    { label: "Favorites", value: stats.favoriteEntries, icon: Heart,    iconClass: "text-accent-red",    bgClass: "bg-accent-red/10",    suffix: "" },
    { label: "Streak",    value: stats.currentStreak,   icon: Flame,    iconClass: "text-accent-orange", bgClass: "bg-accent-orange/10", suffix: "d" },
    { label: "Longest",   value: stats.longestStreak,   icon: Calendar, iconClass: "text-accent-green",  bgClass: "bg-accent-green/10",  suffix: "d" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-default rounded-xl p-4 hover:shadow-medium transition-all"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg flex-shrink-0 ${stat.bgClass}`}>
                <Icon size={18} className={stat.iconClass} />
              </div>
              <div>
                <p className="text-xs text-muted">{stat.label}</p>
                <p className="text-xl font-semibold text-primary tabular-nums">
                  {stat.value}
                  {stat.suffix && (
                    <span className="text-sm ml-0.5 font-normal text-muted">{stat.suffix}</span>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
