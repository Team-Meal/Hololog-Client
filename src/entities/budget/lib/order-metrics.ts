// TASK.md 4.2 산식 — 구조적 타입만 받는 순수 함수라 다른 엔티티를 import하지 않는다.

/** 1인당 단가 = 총 식재료비 ÷ 급식 인원 */
export function perPersonCost(totalCost: number, studentCount: number): number {
  if (studentCount <= 0) return 0;
  return totalCost / studentCount;
}

export interface LocalUsageEntry {
  estimatedCost: number;
  isLocal: boolean;
}

/** 지역 농산물 사용률 = (지역 농산물 식재료비 ÷ 전체 식재료비) × 100 */
export function localUsageRatio(entries: LocalUsageEntry[]): number {
  const total = entries.reduce((sum, e) => sum + e.estimatedCost, 0);
  if (total <= 0) return 0;
  const local = entries.filter((e) => e.isLocal).reduce((sum, e) => sum + e.estimatedCost, 0);
  return (local / total) * 100;
}
