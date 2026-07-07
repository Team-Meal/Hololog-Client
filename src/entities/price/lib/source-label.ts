import type { PriceSource } from "../model/types";

// KAMIS 키 미설정/장애 시 정적 스냅샷으로 대체되므로, 가격 기반 수치를 보여줄 땐
// 실시간 시세인지 샘플 데이터인지 항상 함께 표시해 실데이터로 오인하지 않게 한다.
export function priceSourceLabel(source: PriceSource | null): string {
  switch (source) {
    case "kamis":
      return "KAMIS 실시간 시세 기준";
    case "mixed":
      return "일부 KAMIS 실시간 시세 · 나머지 샘플 가격 기준";
    case "fallback":
      return "실시간 시세 미연동 · 샘플 가격 기준";
    default:
      return "가격 데이터 연동 대기";
  }
}
