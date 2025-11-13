import { useDashboard } from "../../hooks/useDashBoard";

function DashStat() {
  const { stats } = useDashboard();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`p-5 rounded-2xl ${stat.bg} border border-gray-200 dark:border-white/5 shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {stat.title}
              </p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stat.value}
              </h2>
            </div>
            <div className="bg-white/50 dark:bg-white/10 p-2 rounded-lg">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashStat;
