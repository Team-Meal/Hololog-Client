export type IngredientStatus = "정상" | "부족" | "긴급" | "임박";
export type IngredientCategory = "곡물" | "농산물" | "축산" | "수산" | "가공";
export type IngredientUnit = "kg" | "L" | "g" | "모" | "판" | "개";

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  quantity: number;
  unit: IngredientUnit;
  expiryDate: string;
  safetyStock: number;
  status: IngredientStatus;
}

// Server API types — returned by /ingredients endpoints
export interface IngredientItem {
  ingredientId: number;
  name: string;
  quantity: number;
  unit: string;
  expirationDate: string;
  category: string;
  // 백엔드가 아직 제공하지 않는 필드 — 스키마 확장 시 자동으로 표시됨(없으면 미표시)
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
