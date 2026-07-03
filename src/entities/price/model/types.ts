// KAMIS(농산물유통정보) 실시간 가격 — 키 없거나 API 장애 시 폴백 스냅샷으로 대체된다.
export type PriceSource = "kamis" | "fallback" | "mixed";

// /api/kamis/prices가 반환하는 원본 가격 행 (증감률·급등여부는 클라이언트에서 파생).
export interface PriceQuoteRaw {
  itemName: string;
  unit: string;
  price: number; // 현재 kg당 단가
  baselinePrice: number; // 직전 기준 단가 (전주/전월 등)
}

export interface PriceQuote extends PriceQuoteRaw {
  changeRatePercent: number; // (price - baselinePrice) / baselinePrice * 100
  isSpiking: boolean;
  substituteItems: string[];
  source: PriceSource;
}

export interface PriceListResponse {
  items: PriceQuoteRaw[];
  source: PriceSource;
  fetchedAt: string;
}
