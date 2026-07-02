import { FormulaHint, SurfaceCard } from "@/shared/ui";

interface Props {
  label: string;
  value: string;
  sub?: string;
  formulaTitle: string;
  formulaLines: string[];
}

export function KpiCard({ label, value, sub, formulaTitle, formulaLines }: Props) {
  return (
    <SurfaceCard className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium text-zinc-500">{label}</span>
        <FormulaHint title={formulaTitle} lines={formulaLines} />
      </div>
      <p className="text-xl font-bold text-zinc-900">{value}</p>
      {sub && <p className="text-xs text-zinc-400">{sub}</p>}
    </SurfaceCard>
  );
}
