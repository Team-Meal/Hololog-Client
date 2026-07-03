import type { PriceQuoteRaw } from "../model/types";

// KAMIS API 키가 없거나 호출이 실패할 때 쓰는 캐시 스냅샷(현실적인 kg당 원화 단가).
// 토마토는 TASK.md 예시(KAMIS 기준 전주 대비 +18%)와 동일하게 급등 상태로 고정해
// 키 없이도 가격 급등 → 대체 추천 흐름을 시연할 수 있게 한다.
export const FALLBACK_PRICE_SNAPSHOT: PriceQuoteRaw[] = [
  { itemName: "감자", unit: "kg", price: 2800, baselinePrice: 2750 },
  { itemName: "양파", unit: "kg", price: 2100, baselinePrice: 2080 },
  { itemName: "당근", unit: "kg", price: 3200, baselinePrice: 3150 },
  { itemName: "오이", unit: "kg", price: 3100, baselinePrice: 3200 },
  { itemName: "토마토", unit: "kg", price: 3780, baselinePrice: 3200 },
  { itemName: "배추", unit: "kg", price: 1800, baselinePrice: 1820 },
  { itemName: "수박", unit: "kg", price: 4000, baselinePrice: 3950 },
  { itemName: "대파", unit: "kg", price: 2730, baselinePrice: 2600 },
];
