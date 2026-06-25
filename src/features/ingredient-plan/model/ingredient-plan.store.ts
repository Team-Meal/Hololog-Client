import { create } from "zustand";
import { toast } from "sonner";
import type {
  IngredientPlan,
  CreateIngredientPlanRequest,
  UpdateIngredientPlanRequest,
} from "@/entities/ingredient-plan";
import {
  getIngredientPlanById,
  getIngredientPlans,
  createIngredientPlan,
  updateIngredientPlan,
  deleteIngredientPlan,
} from "../api/ingredient-plan.api";

interface IngredientPlanStore {
  plans: IngredientPlan[];
  selectedPlan: IngredientPlan | null;
  isLoading: boolean;
  isDetailLoading: boolean;
  isSaving: boolean;
  error: string | null;
  detailError: string | null;

  isFormOpen: boolean;
  editingPlan: IngredientPlan | null;

  fetchPlans: () => Promise<void>;
  fetchPlanDetail: (planId: number) => Promise<void>;
  createPlan: (data: CreateIngredientPlanRequest) => Promise<boolean>;
  updatePlan: (planId: number, data: UpdateIngredientPlanRequest) => Promise<boolean>;
  deletePlan: (planId: number) => Promise<boolean>;

  openCreate: () => void;
  openEdit: (plan: IngredientPlan) => void;
  closeForm: () => void;
  clearErrors: () => void;
}

function extractMessage(err: unknown, fallback: string): string {
  return err instanceof Error && "response" in err
    ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message ?? fallback)
    : fallback;
}

export const useIngredientPlanStore = create<IngredientPlanStore>((set) => ({
  plans: [],
  selectedPlan: null,
  isLoading: false,
  isDetailLoading: false,
  isSaving: false,
  error: null,
  detailError: null,
  isFormOpen: false,
  editingPlan: null,

  fetchPlans: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getIngredientPlans();
      set({ plans: data, isLoading: false });
    } catch {
      set({ isLoading: false, error: "계획표 목록을 불러오지 못했습니다." });
    }
  },

  fetchPlanDetail: async (planId) => {
    set({ isDetailLoading: true, detailError: null, selectedPlan: null });
    try {
      const data = await getIngredientPlanById(planId);
      set({ selectedPlan: data, isDetailLoading: false });
    } catch {
      set({ isDetailLoading: false, detailError: "계획표를 불러오지 못했습니다." });
    }
  },

  createPlan: async (data) => {
    set({ isSaving: true });
    try {
      await createIngredientPlan(data);
      const plans = await getIngredientPlans();
      set({ plans, isSaving: false });
      toast.success("계획표가 작성되었습니다.");
      return true;
    } catch (err: unknown) {
      const message = extractMessage(err, "계획표 작성 중 오류가 발생했습니다.");
      toast.error(message);
      set({ isSaving: false });
      return false;
    }
  },

  updatePlan: async (planId, data) => {
    set({ isSaving: true });
    try {
      const updated = await updateIngredientPlan(planId, data);
      set((state) => ({
        plans: state.plans.map((p) => (p.ingredientPlanId === planId ? updated : p)),
        selectedPlan:
          state.selectedPlan?.ingredientPlanId === planId ? updated : state.selectedPlan,
        isSaving: false,
      }));
      toast.success("계획표가 수정되었습니다.");
      return true;
    } catch (err: unknown) {
      const message = extractMessage(err, "계획표 수정 중 오류가 발생했습니다.");
      toast.error(message);
      set({ isSaving: false });
      return false;
    }
  },

  deletePlan: async (planId) => {
    try {
      await deleteIngredientPlan(planId);
      set((state) => ({
        plans: state.plans.filter((p) => p.ingredientPlanId !== planId),
        selectedPlan: state.selectedPlan?.ingredientPlanId === planId ? null : state.selectedPlan,
      }));
      toast.success("계획표가 삭제되었습니다.");
      return true;
    } catch (err: unknown) {
      toast.error(extractMessage(err, "계획표 삭제 중 오류가 발생했습니다."));
      return false;
    }
  },

  openCreate: () => set({ isFormOpen: true, editingPlan: null }),
  openEdit: (plan) => set({ isFormOpen: true, editingPlan: plan }),
  closeForm: () => set({ isFormOpen: false, editingPlan: null }),
  clearErrors: () => set({ error: null, detailError: null }),
}));
