import type { PriceSource } from "../model/types";

// 하드코딩된 대체 가격은 없다 — 서버가 실제로 응답한 품목만 존재하므로, 가격 기반
// 수치를 보여줄 땐 몇 개 품목이 실시간으로 조회됐는지 항상 함께 표시한다.
export function priceSourceLabel(source: PriceSource | null): string {
  switch (source) {
    case "kamis":
      return "KAMIS 실시간 시세 기준";
    case "partial":
      return "일부 품목만 KAMIS 실시간 시세 조회됨";
    case "unavailable":
      return "실시간 시세 미연동 (가격 데이터 없음)";
    default:
      return "가격 데이터 연동 대기";
  }
}
