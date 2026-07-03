// 리포트 PDF는 새 창에 HTML 문서를 써서 인쇄 대화상자를 띄우는 방식(식단표 내보내기와 동일).

/** HTML 삽입용 문자열 이스케이프 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 인쇄용 새 창을 열어 HTML을 씀. 팝업이 차단되면 false 반환. */
export function openPrintWindow(html: string): boolean {
  const w = window.open("", "_blank", "width=900,height=760");
  if (!w) return false;
  w.document.write(html);
  w.document.close();
  return true;
}

/** 원(₩) 표기 */
export function won(value: number): string {
  return `₩${Math.round(value).toLocaleString()}`;
}

/** 수량 표기 — 정수면 그대로, 소수면 최대 1자리 */
export function qty(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
