import { useDashboard } from "../../hooks/useDashBoard";
import { motion } from "framer-motion";

function DashStat() {
  const { stats } = useDashboard();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="bg-card border border-default rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-primary mt-1 tabular-nums">
                {stat.value}
              </p>
            </div>
            {/* Icon badge — same size/shape as activity rows */}
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${stat.bg}`}>
              {stat.icon}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default DashStat;
