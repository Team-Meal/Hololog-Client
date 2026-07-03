// 메뉴명 키워드 → 식품 알레르기 유발 표시 대상(식약처 22종 중 발생 빈도 높은 항목) 매핑.
// SEASON_TABLE(entities/ingredient/lib/badges.ts)과 동일한 키워드 매칭 스타일.
//
// 한계: 메뉴명 문자열 매칭이며, 백엔드에 구조화된 알레르기 데이터가 없어 만든 추정치다.
// 이 함수 결과를 노출하는 모든 문서에는 반드시 디스클레이머를 함께 표시해야 한다.
export const ALLERGEN_DISCLAIMER =
  "메뉴명 기반 자동 추정이며 정확한 정보는 영양교사 확인이 필요합니다.";

const ALLERGEN_TABLE: Array<{ keywords: string[]; allergens: string[] }> = [
  {
    keywords: ["카레", "짜장", "우동", "칼국수", "수제비", "빵", "만두"],
    allergens: ["밀", "대두"],
  },
  { keywords: ["계란", "달걀", "에그"], allergens: ["난류"] },
  { keywords: ["우유", "치즈", "크림"], allergens: ["우유"] },
  { keywords: ["돈까스", "제육", "돼지"], allergens: ["돼지고기"] },
  { keywords: ["불고기", "소고기", "쇠고기"], allergens: ["쇠고기"] },
  { keywords: ["닭", "치킨"], allergens: ["닭고기"] },
  { keywords: ["새우"], allergens: ["새우"] },
  { keywords: ["게살", "꽃게"], allergens: ["게"] },
  { keywords: ["오징어"], allergens: ["오징어"] },
  { keywords: ["고등어", "삼치"], allergens: ["고등어"] },
  { keywords: ["조개", "홍합", "바지락"], allergens: ["조개류"] },
  { keywords: ["땅콩"], allergens: ["땅콩"] },
  { keywords: ["호두", "잣"], allergens: ["호두", "잣"] },
  { keywords: ["메밀", "냉면"], allergens: ["메밀"] },
  { keywords: ["두부", "된장", "간장"], allergens: ["대두"] },
  { keywords: ["복숭아"], allergens: ["복숭아"] },
];

/** 메뉴명 문자열에서 키워드 매칭으로 알레르기 유발 항목을 추정한다. */
export function getAllergensForMenuName(name: string): string[] {
  const matched = new Set<string>();
  for (const entry of ALLERGEN_TABLE) {
    if (entry.keywords.some((k) => name.includes(k))) {
      entry.allergens.forEach((a) => matched.add(a));
    }
  }
  return [...matched];
}
