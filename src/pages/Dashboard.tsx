import React from "react";

import DashHeader from "../features/dashboard/DashHeader";
import DashStat from "../features/dashboard/DashStat";
import RecentActivities from "../features/dashboard/RecentActivities";
import { useDashboard } from "../hooks/useDashBoard";
import Section from "../features/dashboard/Section";
import DashboardSkeleton from "../components/skeletons/DashboardSkeleton";

const Dashboard: React.FC = () => {
  const { recentNotes, recentPeople, recentPlaces, recentJournals, isReady } = useDashboard();

  if (!isReady) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-6 mt-15 mb-15 space-y-8 transition-colors duration-300">
      <DashHeader />
      <DashStat />

      <RecentActivities />
      <Section title="Recent Notes"  items={recentNotes} />
      <Section title="Recent People"items={recentPeople} />
      <Section title="Recent Places"  items={recentPlaces} />
      <Section title="Recent Journals" items={recentJournals} />
    </div>
  );
};

export default Dashboard;
