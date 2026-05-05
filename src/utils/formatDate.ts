/**
 * Format a date string as a human-readable relative time.
 * Uses calendar-day comparison so a record created 1 minute ago
 * shows "Today" not "Yesterday".
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const now = new Date();

  // Compare calendar dates (strip time component)
  const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const today   = new Date(now.getFullYear(),  now.getMonth(),  now.getDate());

  const diffMs   = today.getTime() - dateDay.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Same calendar day — show time
    return `Today at ${date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7)   return `${diffDays} days ago`;
  if (diffDays < 30)  return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? "s" : ""} ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

/**
 * Short version — used in compact cards (no time, just relative day).
 */
export function formatRelativeDateShort(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const now   = new Date();
  const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const today   = new Date(now.getFullYear(),  now.getMonth(),  now.getDate());

  const diffDays = Math.round((today.getTime() - dateDay.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7)   return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
