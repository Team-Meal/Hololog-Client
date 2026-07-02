"use client";

import { create } from "zustand";

// 발주표 시연에 필요한 상태(급식 인원 / 품목별 재고 수동 입력값)만 갖는 스토어.
// 다른 엔티티를 전혀 참조하지 않아 features/order-plan-calc, features/report-export,
// widgets/budget-validation, widgets/inventory-table, widgets/dashboard-metrics 등
// 어디서든 사이드웨이 import 없이 같은 값을 공유할 수 있다.
interface OrderPlanCalcState {
  studentCount: number;
  stockOverrides: Record<string, number>;
  setStudentCount: (count: number) => void;
  setStockOverride: (ingredientName: string, quantity: number) => void;
  clearStockOverride: (ingredientName: string) => void;
}

export const DEFAULT_ORDER_PLAN_STUDENT_COUNT = 300;

export const useOrderPlanCalcStore = create<OrderPlanCalcState>((set) => ({
  studentCount: DEFAULT_ORDER_PLAN_STUDENT_COUNT,
  stockOverrides: {},

  setStudentCount: (count) => set({ studentCount: Math.max(0, count) }),

  setStockOverride: (ingredientName, quantity) =>
    set((state) => ({
      stockOverrides: { ...state.stockOverrides, [ingredientName]: Math.max(0, quantity) },
    })),

  clearStockOverride: (ingredientName) =>
    set((state) => {
      const next = { ...state.stockOverrides };
      delete next[ingredientName];
      return { stockOverrides: next };
    }),
}));
