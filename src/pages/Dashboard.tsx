import React from "react";

import DashHeader from "../features/dashboard/DashHeader";
import DashStat from "../features/dashboard/DashStat";
import RecentActivities from "../features/dashboard/RecentActivities";
const Dashboard: React.FC = () => {
  return (
    <div className="p-6 mt-15 space-y-8 transition-colors duration-300">
      <DashHeader />
      <DashStat />
      <RecentActivities />
    </div>
  );
};

export default Dashboard;
