import { priceSourceLabel, type PriceSource, type SubstitutionSaving } from "@/entities/price";

interface Props {
  substitutions: SubstitutionSaving[];
  priceSource: PriceSource | null;
}

export function PriceSpikePanel({ substitutions, priceSource }: Props) {
  if (substitutions.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-amber-50 p-3">
      {substitutions.map((s) => (
        <div key={s.itemName} className="text-sm">
          <p className="text-amber-700">
            가격 상승 품목: <span className="font-semibold">{s.itemName}</span> (
            {priceSourceLabel(priceSource)} 전주 대비 급등)
          </p>
          <p className="text-zinc-600">
            대체 추천: <span className="font-medium">{s.substituteName}</span> · 예상 절감액 ₩
            {Math.round(s.savings).toLocaleString("ko-KR")}
          </p>
        </div>
      ))}
    </div>
  );
}
