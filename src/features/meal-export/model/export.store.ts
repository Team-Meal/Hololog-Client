import { create } from "zustand";
import type { ExportFormType, PreviewMode } from "@/entities/meal";

interface ExportState {
  selectedForm: ExportFormType;
  previewMode: PreviewMode;
  setSelectedForm: (form: ExportFormType) => void;
  setPreviewMode: (mode: PreviewMode) => void;
}

export const useExportStore = create<ExportState>((set) => ({
  selectedForm: "official",
  previewMode: "screen",
  setSelectedForm: (form) => set({ selectedForm: form }),
  setPreviewMode: (mode) => set({ previewMode: mode }),
}));
