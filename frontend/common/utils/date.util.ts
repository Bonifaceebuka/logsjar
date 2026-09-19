export function timeAgo(dateString: string): string {
  if(!dateString) return "";

  const now = new Date();
  const past = new Date(dateString);
  if (!(past instanceof Date)) return "";

  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (seconds < 5) return "just now";

  const intervals: { label: string; seconds: number }[] = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);

    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

export function formatShortDate(timestamp: string | number) {
  console.log({timestamp})
  const value = Number(timestamp);

  if (Number.isNaN(value)) {
    return "Invalid Date";
  }

  const date = new Date(
    value < 10_000_000_000 ? value * 1000 : value
  );

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}