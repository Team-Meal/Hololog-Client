export type IngredientCategory = "곡물" | "농산물" | "축산" | "수산" | "가공";

// Server API types — returned by /ingredients endpoints
export interface IngredientItem {
  ingredientId: number;
  name: string;
  quantity: number;
  unit: string;
  expirationDate: string;
  category: string;
  origin?: string; // 원산지
  supplier?: string; // 공급처
}

export interface IngredientDetail extends IngredientItem {
  createdAt: string;
}

export interface CreateIngredientPayload {
  name: string;
  quantity?: number;
  unit: string;
  expirationDate?: string;
  category: string;
  origin?: string;
  supplier?: string;
}

export interface PatchIngredientPayload {
  name?: string;
  quantity?: number;
  unit?: string;
  expirationDate?: string;
  category?: string;
  origin?: string;
  supplier?: string;
}

export interface PatchIngredientResponse extends IngredientItem {
  updatedAt: string;
}
