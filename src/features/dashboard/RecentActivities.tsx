import { useDashboard } from "../../hooks/useDashBoard";
import type { ActivityItem } from "../../type/DashboardType";

function RecentActivities() {
  const {activities} = useDashboard()
      const typeIcons: Record<ActivityItem["type"], string> = {
        people: "🧍",
        places: "📍",
        notes: "📝",
        journals: "📖",
      };
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        Recent Activity
      </h2>
      <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 transition-colors">
        {activities.length > 0 ? (
          <ul className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
            {activities.map((item) => (
              <li key={`${item.type}-${item.id}`}>
                {typeIcons[item.type]}{" "}
                <span className="font-medium capitalize">{item.type}</span> —{" "}
                <span>{item.title || "Untitled"}</span>{" "}
                <span className="text-gray-400 text-xs">
                  ({new Date(item.createdAt).toLocaleDateString()})
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm italic">
            No recent activity yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default RecentActivities;