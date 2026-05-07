import { motion } from "framer-motion";
import { Users, Heart, Tag, Mail, Phone, Globe } from "lucide-react";
import type { PeopleStats } from "../../type/PeopleType";

interface PeopleStatsProps {
  stats: PeopleStats;
}

export default function PeopleStats({ stats }: PeopleStatsProps) {
  const statCards = [
    { label: "Total People", value: stats.totalPeople,           icon: Users, iconClass: "text-primary-500",    bgClass: "bg-primary-500/10" },
    { label: "Favorites",    value: stats.favoritePeople,        icon: Heart, iconClass: "text-accent-red",     bgClass: "bg-accent-red/10" },
    { label: "Relations",    value: stats.uniqueRelations,       icon: Tag,   iconClass: "text-accent-green",   bgClass: "bg-accent-green/10" },
    { label: "With Email",   value: stats.contactMethods.email,  icon: Mail,  iconClass: "text-accent-blue",    bgClass: "bg-accent-blue/10" },
    { label: "With Phone",   value: stats.contactMethods.phone,  icon: Phone, iconClass: "text-accent-orange",  bgClass: "bg-accent-orange/10" },
    { label: "On Social",    value: stats.contactMethods.social, icon: Globe, iconClass: "text-accent-purple",  bgClass: "bg-accent-purple/10" },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card border border-default rounded-xl p-3 hover:shadow-medium transition-all"
          >
            <div className="flex flex-col items-center text-center gap-1.5">
              <div className={`p-2 rounded-lg ${stat.bgClass}`}>
                <Icon size={16} className={stat.iconClass} />
              </div>
              <p className="text-base font-semibold text-primary tabular-nums">{stat.value}</p>
              <p className="text-xs text-muted leading-tight">{stat.label}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
