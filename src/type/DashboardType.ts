type ActivityType = "people" | "places" | "notes" | "journals";

export type ActivityItem = {
  id: number;
  type: ActivityType;
  title: string;
  createdAt: string;
};
