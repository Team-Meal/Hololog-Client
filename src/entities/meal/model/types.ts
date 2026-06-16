export type ExportFormType = "official" | "newsletter" | "student";
export type PreviewMode = "screen" | "print";
export type DayOfWeek = "월" | "화" | "수" | "목" | "금";

export interface DayMenu {
  dayOfWeek: DayOfWeek;
  date: string;
  items: string[];
}

export interface WeeklyMealSchedule {
  year: number;
  month: number;
  week: number;
  schoolName: string;
  districtName: string;
  nutritionistName: string;
  principalName: string;
  days: DayMenu[];
}
