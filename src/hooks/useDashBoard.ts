import { createContext, useContext, type JSX } from "react";
import type { ActivityItem } from "../type/DashboardType";
interface DashboardContextType {
  stats: {
    title: string;
    value: number;
    icon: JSX.Element;
    bg: string;
  }[];
  activities: ActivityItem[];
}

export const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined)
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  return context;
}