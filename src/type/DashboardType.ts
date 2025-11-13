type ActivityType = "people" | "places" | "notes" | "journals";

export type ActivityItem = {
  id: string;
  type: ActivityType;
  title: string;
  createdAt: string;
};
