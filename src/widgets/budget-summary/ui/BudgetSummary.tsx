interface Segment {
  label: string;
  amount: number; // 만원
  color: string; // hex (SVG stroke)
  dotClass: string;
}

const TOTAL = 7200; // 만원
const SPENT = 4821; // 만원

// 퍼블리싱용 mock 데이터
const SEGMENTS: Segment[] = [
  { label: "농산물", amount: 1684, color: "#22c55e", dotClass: "bg-emerald-500" },
  { label: "축산·수산", amount: 2012, color: "#3b82f6", dotClass: "bg-blue-500" },
  { label: "가공·곡물", amount: 824, color: "#8b5cf6", dotClass: "bg-violet-500" },
  { label: "기타", amount: 301, color: "#9ca3af", dotClass: "bg-gray-400" },
];

const R = 42;
const C = 2 * Math.PI * R;

// 누적 오프셋을 렌더 전에 순수 계산해 둔다 (렌더 중 변수 변경 금지).
const ARCS = SEGMENTS.map((seg, i) => {
  const len = (seg.amount / TOTAL) * C;
  const offset = SEGMENTS.slice(0, i).reduce((sum, prev) => sum + (prev.amount / TOTAL) * C, 0);
  return { ...seg, len, offset };
});

export function BudgetSummary() {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">예산 · 6월</p>
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
          67% 집행
        </span>
      </div>

      <div className="mt-4 flex items-center gap-6">
        {/* Donut */}
        <div className="relative h-32 w-32 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
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
            <span className="text-lg font-bold tracking-tight text-gray-900">
              {SPENT.toLocaleString()}
            </span>
            <span className="text-[11px] text-gray-400">/ ₩{TOTAL.toLocaleString()}만</span>
          </div>
        </div>

        {/* Legend */}
        <ul className="flex-1 space-y-2.5">
          {SEGMENTS.map((seg) => (
            <li key={seg.label} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-gray-600">
                <span className={`h-2.5 w-2.5 rounded-full ${seg.dotClass}`} />
                {seg.label}
              </span>
              <span className="font-medium text-gray-900">₩{seg.amount.toLocaleString()}만</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
