import type { RecipeIngredient } from "../model/types";

// 데모용 메뉴별 1인 사용량 데이터셋 — 기본 급식 인원(300명) 기준으로
// TASK.md 3.3 예시(감자 18kg·오이 12kg·수박 20kg)와 동일한 값이 나오도록 보정했다.
// KAMIS 연동 8개 핵심 품목(감자·양파·당근·오이·토마토·배추·수박·대파)을 전부 포함해
// 가격/제철/급등 로직이 실제로 맞물리도록 구성.
export const DEMO_RECIPES: RecipeIngredient[] = [
  {
    menuName: "감자카레",
    ingredientName: "감자",
    unit: "kg",
    perPersonUsage: 0.06,
    defaultSupplierName: "광주 로컬푸드",
    nutritionTags: ["균형 영양"],
  },
  {
    menuName: "감자카레",
    ingredientName: "양파",
    unit: "kg",
    perPersonUsage: 0.03,
    defaultSupplierName: "광주 로컬푸드",
    nutritionTags: ["균형 영양"],
  },
  {
    menuName: "감자카레",
    ingredientName: "당근",
    unit: "kg",
    perPersonUsage: 0.02,
    defaultSupplierName: "전남 지역농가",
    nutritionTags: ["균형 영양"],
  },
  {
    menuName: "오이무침",
    ingredientName: "오이",
    unit: "kg",
    perPersonUsage: 0.04,
    defaultSupplierName: "전남 지역농가",
    nutritionTags: ["저나트륨", "저지방"],
  },
  {
    menuName: "제철과일",
    ingredientName: "수박",
    unit: "kg",
    perPersonUsage: 0.0667,
    defaultSupplierName: "지역 공급처",
    nutritionTags: ["비타민", "저지방"],
  },
  {
    menuName: "배추된장국",
    ingredientName: "배추",
    unit: "kg",
    perPersonUsage: 0.03,
    defaultSupplierName: "전남 지역농가",
    nutritionTags: ["저나트륨"],
  },
  {
    menuName: "어묵볶음",
    ingredientName: "대파",
    unit: "kg",
    perPersonUsage: 0.01,
    defaultSupplierName: "광주 로컬푸드",
    nutritionTags: ["단백질"],
  },
  {
    menuName: "토마토달걀볶음",
    ingredientName: "토마토",
    unit: "kg",
    perPersonUsage: 0.025,
    defaultSupplierName: "지역 공급처",
    nutritionTags: ["단백질", "비타민"],
  },
];

// 발주표/예산/AI 스코어링에서 공통으로 쓰는 기본 급식 인원.
export const DEFAULT_STUDENT_COUNT = 300;
