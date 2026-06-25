import { create } from "zustand";

interface MealCalendarState {
  // Currently selected diet (for highlight / detail). Null when none.
  selectedDietId: number | null;
  setSelectedDietId: (id: number | null) => void;
  // Bumped to force the calendar to refetch (e.g. after creating a diet).
  reloadToken: number;
  bumpReload: () => void;
}

export const useMealCalendarStore = create<MealCalendarState>((set) => ({
  selectedDietId: null,
  setSelectedDietId: (id) => set({ selectedDietId: id }),
  reloadToken: 0,
  bumpReload: () => set((state) => ({ reloadToken: state.reloadToken + 1 })),
}));
