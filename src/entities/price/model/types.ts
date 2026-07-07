// KAMIS(농산물유통정보) 실시간 가격 — 인증키 미설정/전체 조회 실패 시 items가 빈 배열로 온다.
// 하드코딩된 대체 가격은 없음: 서버가 실제로 응답한 값만 내려준다.
export type PriceSource = "kamis" | "partial" | "unavailable";

// /api/kamis/prices가 반환하는 원본 가격 행 (증감률·급등여부는 클라이언트에서 파생).
export interface PriceQuoteRaw {
  itemName: string;
  unit: string;
  price: number; // 현재 kg당 단가
  // 직전 기준 단가. KAMIS 기간별 조회를 아직 붙이지 않아 실제 이력 비교값이 없으므로
  // 항상 price와 동일하게 채워 "변동 없음"으로 표시한다 — 가짜 증감률을 만들지 않기 위함.
  baselinePrice: number;
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
