import type { PriceQuote } from "../model/types";

// 예산 절감 예상액 = Σ(가격 급등 품목 대체로 줄인 비용) — TASK.md 4.2.
// 구조적 타입(ingredientName/quantity/unitPrice)만 받아 order-plan 엔티티를
// 몰라도 되게 만들어, 대시보드/예산/리포트 등 여러 곳에서 중복 구현 없이 재사용한다.
export interface CostLine {
  ingredientName: string;
  quantity: number;
  unitPrice: number;
}

export interface SubstitutionSaving {
  itemName: string;
  substituteName: string;
  originalCost: number;
  substituteCost: number;
  savings: number;
}

export function computeSubstitutionSavings(
  lines: CostLine[],
  quotes: PriceQuote[],
): SubstitutionSaving[] {
  const quoteByName = new Map(quotes.map((q) => [q.itemName, q]));

  const results: SubstitutionSaving[] = [];
  for (const line of lines) {
    const quote = quoteByName.get(line.ingredientName);
    if (!quote || !quote.isSpiking || quote.substituteItems.length === 0) continue;

    const cheapestSubstitute = quote.substituteItems
      .map((name) => quoteByName.get(name))
      .filter((q): q is PriceQuote => q !== undefined)
      .sort((a, b) => a.price - b.price)[0];
    if (!cheapestSubstitute || cheapestSubstitute.price >= line.unitPrice) continue;

    const originalCost = line.quantity * line.unitPrice;
    const substituteCost = line.quantity * cheapestSubstitute.price;
    results.push({
      itemName: line.ingredientName,
      substituteName: cheapestSubstitute.itemName,
      originalCost,
      substituteCost,
      savings: originalCost - substituteCost,
    });
  }
  return results;
}

export function totalSubstitutionSavings(lines: CostLine[], quotes: PriceQuote[]): number {
  return computeSubstitutionSavings(lines, quotes).reduce((sum, s) => sum + s.savings, 0);
}
