import type { DietListItem } from "../model/types";

export interface DietDateGroup {
  date: string; // YYYY-MM-DD
  diets: DietListItem[];
}

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

// Korean single-char weekday for a YYYY-MM-DD date. Parsed at local midnight so
// the label doesn't shift across time zones.
export function weekdayLabel(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? "" : WEEKDAY_LABELS[parsed.getDay()];
}

// "YYYY-MM-DD" → "M/D" for compact display.
export function shortDate(date: string): string {
  const [, month, day] = date.split("-");
  return month && day ? `${Number(month)}/${Number(day)}` : date;
}

// Group a flat diet list by dietDate, sorted ascending by date.
export function groupDietsByDate(diets: DietListItem[]): DietDateGroup[] {
  const byDate = new Map<string, DietListItem[]>();
  for (const diet of diets) {
    const list = byDate.get(diet.dietDate) ?? [];
    list.push(diet);
    byDate.set(diet.dietDate, list);
  }
  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, items]) => ({ date, diets: items }));
}
