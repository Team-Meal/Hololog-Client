import { StatusBadge, SurfaceCard } from "@/shared/ui";

interface Segment {
  label: string;
  amount: number;
  color: string;
  dotClass: string;
}

const TOTAL = 7200;
const SPENT = 4821;

const SEGMENTS: Segment[] = [
  { label: "농산물", amount: 1684, color: "#22c55e", dotClass: "bg-emerald-500" },
  { label: "축산·수산", amount: 2012, color: "#3b82f6", dotClass: "bg-blue-500" },
  { label: "가공식품", amount: 824, color: "#8b5cf6", dotClass: "bg-violet-500" },
  { label: "기타", amount: 301, color: "#9ca3af", dotClass: "bg-zinc-400" },
];

const R = 42;
const C = 2 * Math.PI * R;

const ARCS = SEGMENTS.map((segment, index) => {
  const len = (segment.amount / TOTAL) * C;
  const offset = SEGMENTS.slice(0, index).reduce(
    (sum, previous) => sum + (previous.amount / TOTAL) * C,
    0,
  );
  return { ...segment, len, offset };
});

export function BudgetSummary() {
  return (
    <SurfaceCard>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-zinc-950">예산 · 6월</p>
        <StatusBadge tone="blue">67% 진행</StatusBadge>
      </div>

      <div className="mt-4 flex items-center gap-6">
        <div className="relative size-32 shrink-0">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden="true">
            <circle cx="50" cy="50" r={R} fill="none" stroke="#f3f4f6" strokeWidth="12" />
            {ARCS.map((arc) => (
              <circle
                key={arc.label}
                cx="50"
                cy="50"
                r={R}
                fill="none"
                stroke={arc.color}
                strokeWidth="12"
                strokeDasharray={`${arc.len} ${C - arc.len}`}
                strokeDashoffset={-arc.offset}
                strokeLinecap="butt"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold tracking-tight text-zinc-950">
              {SPENT.toLocaleString()}
            </span>
            <span className="text-[11px] text-zinc-400">/ {TOTAL.toLocaleString()}만원</span>
          </div>
        </div>

        <ul className="flex-1 space-y-2.5">
          {SEGMENTS.map((segment) => (
            <li key={segment.label} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-zinc-600">
                <span className={`size-2.5 rounded-full ${segment.dotClass}`} />
                {segment.label}
              </span>
              <span className="font-semibold text-zinc-950">{segment.amount.toLocaleString()}만원</span>
            </li>
          ))}
        </ul>
      </div>
    </SurfaceCard>
  );
}
