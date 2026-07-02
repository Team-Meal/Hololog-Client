import type { IngredientItem } from "@/entities/ingredient";

// 레시피의 농산물명과 실제 재고 품목명을 매칭 — 정확 일치 우선, 없으면 부분 일치.
// (예: 레시피 "감자" ↔ 재고 "햇감자" 같은 표기 차이를 허용)
export function findIngredientByName(
  items: IngredientItem[],
  name: string,
): IngredientItem | undefined {
  const exact = items.find((item) => item.name === name);
  if (exact) return exact;

  return items.find((item) => item.name.includes(name) || name.includes(item.name));
}
