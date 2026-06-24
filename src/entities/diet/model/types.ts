export interface DietItem {
  id: number;
  name: string;
  dietDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface DietDetail extends DietItem {
  description: string;
}

// POST /diets — server expects a generic JsonNode
export type CreateDietPayload = Record<string, unknown>;

export interface PatchDietPayload {
  name: string;
  description?: string;
  dietDate: string;
}

// Leftover data
export type LeftoverUnit = "KG" | "G" | "L" | "ML" | "EA" | "BOX";

export interface LeftoverItem {
  id: number;
  name: string;
  dietDate: string;
  amount: number;
  unit: LeftoverUnit;
  memo: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeftoverPayload {
  amount: number;
  unit: LeftoverUnit;
  memo?: string;
}

// Export
export type DietExportFormat = "PDF" | "EXCEL" | "IMAGE";

export interface ExportPayload {
  dietExportFormat: DietExportFormat;
}

export interface ExportResponse {
  id: number;
  dietExportFormat: DietExportFormat;
  fileUrl: string;
}
