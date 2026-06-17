export type ExportFormType = "official" | "newsletter" | "student";
export type PreviewMode = "screen" | "print";
export type DayOfWeek = "월" | "화" | "수" | "목" | "금";
export type MealType = "조식" | "중식" | "석식";

export interface MealItem {
  type: MealType;
  name: string;
  sides: string[];
}

export interface DayMenu {
  dayOfWeek: DayOfWeek;
  date: string;
  meals: MealItem[];
}

export interface MonthlyMealSchedule {
  year: number;
  month: number;
  schoolName: string;
  districtName: string;
  nutritionistName: string;
  principalName: string;
  weeks: WeeklyMealSchedule[];
}

export interface WeeklyMealSchedule {
  year: number;
  month: number;
  week: number;
  schoolName: string;
  districtName: string;
  nutritionistName: string;
  principalName: string;
  nutritionScore: number;
  days: DayMenu[];
}
