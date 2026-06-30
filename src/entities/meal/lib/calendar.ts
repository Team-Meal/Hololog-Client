// Month-grid helpers for the 월간 식단표 calendar. Weeks run 월 → 일 (Mon-first),
// matching the Korean school-meal layout the UI asks for.

export interface MonthRef {
  year: number;
  month: number; // 1-based (1 = January)
}

export interface MonthGridDay {
  date: string; // YYYY-MM-DD
  day: number; // 1..31
  inMonth: boolean; // false for leading/trailing days borrowed from adjacent months
  weekday: number; // 0=Sun .. 6=Sat
}

const pad = (n: number) => String(n).padStart(2, "0");

function dateToStr(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// The month containing today (local time).
export function currentMonth(): MonthRef {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

// Shift a month by ±N months, rolling the year over as needed.
export function addMonths({ year, month }: MonthRef, delta: number): MonthRef {
  const d = new Date(year, month - 1 + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

export function monthLabel({ year, month }: MonthRef): string {
  return `${year}년 ${month}월`;
}

// "YYYY-MM" key for the month.
export function monthKey({ year, month }: MonthRef): string {
  return `${year}-${pad(month)}`;
}

// Mon-first weekday labels for the header row.
export const WEEKDAY_HEADERS = ["월", "화", "수", "목", "금", "토", "일"] as const;

// Build a Mon-first month grid: an array of weeks, each week exactly 7 days.
// Leading/trailing cells borrowed from the neighbouring months keep every row full.
export function buildMonthGrid({ year, month }: MonthRef): MonthGridDay[][] {
  // JS getDay() is Sun=0..Sat=6; remap so Mon=0..Sun=6.
  const firstWeekdayMonFirst = (new Date(year, month - 1, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();
  const weekCount = Math.ceil((firstWeekdayMonFirst + daysInMonth) / 7);

  const start = new Date(year, month - 1, 1 - firstWeekdayMonFirst);
  const weeks: MonthGridDay[][] = [];

  for (let w = 0; w < weekCount; w++) {
    const week: MonthGridDay[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + w * 7 + i);
      week.push({
        date: dateToStr(d),
        day: d.getDate(),
        inMonth: d.getMonth() === month - 1,
        weekday: d.getDay(),
      });
    }
    weeks.push(week);
  }

  return weeks;
}
