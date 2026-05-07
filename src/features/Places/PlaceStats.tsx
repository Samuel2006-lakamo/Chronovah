import { motion } from "framer-motion";
import { MapPin, Globe, Heart, Tag } from "lucide-react";
import type { PlaceStats } from "../../type/PlaceType";

interface PlaceStatsProps {
  stats: PlaceStats;
}

export default function PlaceStats({ stats }: PlaceStatsProps) {
  const statCards = [
    {
      label: "Total Places",
      value: stats.totalPlaces,
      icon: MapPin,
      iconClass: "text-primary-500",
      bgClass: "bg-primary-500/10",
    },
    {
      label: "Countries",
      value: stats.visitedCountries,
      icon: Globe,
      iconClass: "text-accent-blue",
      bgClass: "bg-accent-blue/10",
    },
    {
      label: "Favorites",
      value: stats.favoritePlaces,
      icon: Heart,
      iconClass: "text-accent-red",
      bgClass: "bg-accent-red/10",
    },
    {
      label: "Place Types",
      value: Object.keys(stats.typesCount).length,
      icon: Tag,
      iconClass: "text-accent-green",
      bgClass: "bg-accent-green/10",
    },
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
                <p className="text-xl font-semibold text-primary tabular-nums">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
