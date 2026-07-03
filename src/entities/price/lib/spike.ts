// 전주/전월 대비 가격 급등 판정 — 순수 산술만 다루므로 I/O 없이 단독 검증 가능.
export const SPIKE_THRESHOLD_PERCENT = 10;

export function computeChangeRatePercent(price: number, baselinePrice: number): number {
  if (!baselinePrice) return 0;
  return ((price - baselinePrice) / baselinePrice) * 100;
}

export function isSpiking(changeRatePercent: number): boolean {
  return changeRatePercent >= SPIKE_THRESHOLD_PERCENT;
}
