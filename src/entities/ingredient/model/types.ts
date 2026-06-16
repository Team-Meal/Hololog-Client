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
