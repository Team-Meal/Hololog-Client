// 메뉴별 1인 사용량 데모 데이터셋의 타입.
// 백엔드에 레시피 API가 없어 프론트에서 관리 — 추후 백엔드가 제공하면
// config/recipes.ts를 API 호출로 교체하되 이 타입/시그니처는 유지한다.
export interface RecipeIngredient {
  menuName: string; // 메뉴
  ingredientName: string; // 필요 농산물
  unit: string; // 단위 (재고 수량과 동일 단위 가정, kg 기준 — MVP 한계)
  perPersonUsage: number; // 1인 기준 사용량
  defaultSupplierName: string; // 기본 추천 공급처
  nutritionTags?: string[]; // 영양 기준 매칭용 태그
}
