// 가격 급등 품목 → 대체 추천 품목 매핑 (TASK.md 3.5 예시 포함).
export const SUBSTITUTE_MAP: Record<string, string[]> = {
  토마토: ["오이", "양배추"],
  배추: ["양배추"],
  오이: ["애호박"],
};

export function getSubstitutes(itemName: string): string[] {
  return SUBSTITUTE_MAP[itemName] ?? [];
}
