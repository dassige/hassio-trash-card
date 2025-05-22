import type { CalendarEvent } from "./calendarEvents";
import type { ItemSettings } from "./itemSettings";

const filterEventByPatterns = (
  { pattern, pattern_exact, isPatternRegex }: ItemSettings,
  { content: { summary } }: CalendarEvent
) => {
  if (pattern_exact) {
    return pattern && summary.toLowerCase() === pattern.toLowerCase();
  }
  if (isPatternRegex) {
    try {
      if (typeof pattern === "string") {
        const regex = new RegExp(pattern);
        return pattern && regex.test(summary);
      }
    } catch (e) {
      console.warn("Invalid regex pattern", pattern, e);
    }
    return false;
  }
  return pattern && summary.toLowerCase().includes(pattern.toLowerCase());
};

export { filterEventByPatterns };
