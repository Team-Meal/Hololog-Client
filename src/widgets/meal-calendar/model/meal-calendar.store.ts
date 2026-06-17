import { create } from "zustand";
import type { DayOfWeek } from "@/entities/meal";

type ViewMode = "주간" | "월간";

interface MealCalendarState {
  viewMode: ViewMode;
  selectedWeek: 1 | 2 | 3 | 4;
  selectedDay: DayOfWeek;
  setViewMode: (mode: ViewMode) => void;
  setSelectedWeek: (week: 1 | 2 | 3 | 4) => void;
  setSelectedDay: (day: DayOfWeek) => void;
}

export const useMealCalendarStore = create<MealCalendarState>((set) => ({
  viewMode: "주간",
  selectedWeek: 1,
  selectedDay: "금",
  setViewMode: (mode) => set({ viewMode: mode }),
  setSelectedWeek: (week) => set({ selectedWeek: week }),
  setSelectedDay: (day) => set({ selectedDay: day }),
}));
