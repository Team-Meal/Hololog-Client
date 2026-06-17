/** 숫자를 원화 표기(₩186,000)로 변환한다. */
export function formatWon(value: number): string {
  return `₩${value.toLocaleString("ko-KR")}`;
}
