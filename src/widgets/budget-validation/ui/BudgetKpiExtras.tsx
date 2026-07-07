import { priceSourceLabel, type PriceSource } from "@/entities/price";
import { FormulaHint } from "@/shared/ui";
import type { BudgetKpis } from "../lib/budget-kpis";

const won = (value: number) => `₩${Math.round(value).toLocaleString("ko-KR")}`;

interface Props {
  kpis: BudgetKpis;
  savingsWon: number | null;
  priceSource: PriceSource | null;
}

export function BudgetKpiExtras({ kpis, savingsWon, priceSource }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Tile
        label="1인당 예상 단가"
        value={won(kpis.perPersonCost)}
        formulaTitle="1인당 단가"
        formulaLines={["1인당 단가 = 총 식재료비 ÷ 급식 인원"]}
      />
      <Tile
        label="지역 농산물 집행 비중"
        value={`${kpis.localUsageRatioPercent.toFixed(1)}%`}
        formulaTitle="지역 농산물 사용률"
        formulaLines={["지역 농산물 사용률 = (지역 농산물 식재료비 ÷ 전체 식재료비) × 100"]}
      />
      <Tile
        label="예산 절감 예상액"
        value={savingsWon !== null ? won(savingsWon) : "연동 대기"}
        note={savingsWon !== null ? priceSourceLabel(priceSource) : undefined}
        formulaTitle="예산 절감 예상액"
        formulaLines={["예산 절감 예상액 = Σ(가격 급등 품목 대체로 줄인 비용)"]}
      />
    </div>
  );
}

function Tile({
  label,
  value,
  note,
  formulaTitle,
  formulaLines,
}: {
  label: string;
  value: string;
  note?: string;
  formulaTitle: string;
  formulaLines: string[];
}) {
  return (
    <div className="rounded-xl bg-zinc-50 p-3">
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-zinc-500">{label}</span>
        <FormulaHint title={formulaTitle} lines={formulaLines} />
      </div>
      <p className="mt-1 text-lg font-bold text-zinc-900">{value}</p>
      {note && <p className="mt-0.5 text-[11px] text-zinc-400">{note}</p>}
    </div>
  );
}
