import { create } from "zustand";

type ViewMode = "주간" | "월간";

interface MealCalendarState {
  viewMode: ViewMode;
  selectedWeek: 1 | 2 | 3 | 4;
  setViewMode: (mode: ViewMode) => void;
  setSelectedWeek: (week: 1 | 2 | 3 | 4) => void;
}

export const useMealCalendarStore = create<MealCalendarState>((set) => ({
  viewMode: "주간",
  selectedWeek: 1,
  setViewMode: (mode) => set({ viewMode: mode }),
  setSelectedWeek: (week) => set({ selectedWeek: week }),
}));
