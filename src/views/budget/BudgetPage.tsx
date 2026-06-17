import { Button, DownloadIcon, CalendarIcon, SparklesIcon } from "@/shared/ui";
import { NxArea } from "@/shared/ui";

const TOTAL = 7200;
const SPENT = 4821;
const REMAINING = TOTAL - SPENT;
const EXEC_PCT = Math.round((SPENT / TOTAL) * 100);

const CATEGORIES = [
  { label: "농산물", spent: 1684, budget: 2000, color: "#22c55e", trackColor: "bg-emerald-500" },
  { label: "축산·수산", spent: 2012, budget: 2600, color: "#3b82f6", trackColor: "bg-blue-500" },
  { label: "가공·곡물", spent: 824, budget: 1400, color: "#8b5cf6", trackColor: "bg-violet-500" },
  { label: "기타", spent: 301, budget: 1200, color: "#9ca3af", trackColor: "bg-gray-400" },
];

const MONTHLY_TREND = [
  { label: "1월", value: 5820 },
  { label: "2월", value: 6100 },
  { label: "3월", value: 5690 },
  { label: "4월", value: 6350 },
  { label: "5월", value: 6580 },
  { label: "6월", value: 4821 },
];

const R = 42;
const C = 2 * Math.PI * R;
const ARCS = CATEGORIES.map((cat, i) => {
  const len = (cat.spent / TOTAL) * C;
  const offset = CATEGORIES.slice(0, i).reduce((sum, p) => sum + (p.spent / TOTAL) * C, 0);
  return { ...cat, len, offset };
});

const AI_TIPS = [
  {
    text: "축산 품목을 셋째 주에 집중 발주하면 가격 안정기를 활용해 약 42만원을 아낄 수 있어요.",
    iconBg: "bg-blue-100",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
  {
    text: "현재 집행률 추세라면 이달 가공·곡물 예산이 3% 초과될 전망이에요.",
    iconBg: "bg-amber-100",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    text: "잔반 감축 목표 달성 시 다음 달 예산을 5% 절감할 수 있어요.",
    iconBg: "bg-green-100",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    ),
  },
];

export function BudgetPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-blue-600">예산 관리</p>
          <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-gray-900">
            예산 현황 · 2026년 6월
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            월 식자재 예산의 집행 현황과 카테고리별 배분을 한눈에 확인하세요.
          </p>
        </div>
        <Button variant="secondary" size="md">
          <DownloadIcon size={16} />
          리포트 내보내기
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">월 예산</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            ₩{TOTAL.toLocaleString()}만
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1 text-xs text-gray-500">
            <CalendarIcon size={12} />
            2026년 6월
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">집행액</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-blue-600">
            ₩{SPENT.toLocaleString()}만
          </p>
          <p className="mt-1 text-xs text-gray-400">집행액 · {EXEC_PCT}%</p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${EXEC_PCT}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">잔여 예산</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-emerald-600">
            ₩{REMAINING.toLocaleString()}만
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            안정적 집행
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: category bars + monthly trend */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* 카테고리별 예산 배분 */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-base font-semibold text-gray-900">카테고리별 예산 배분</h2>
              <p className="text-sm text-gray-400">예산 대비 집행액</p>
            </div>
            <div className="mt-6 flex flex-col gap-5">
              {CATEGORIES.map((cat) => {
                const pct = Math.round((cat.spent / cat.budget) * 100);
                const isHigh = pct >= 90;
                return (
                  <div key={cat.label}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{cat.label}</span>
                      <span className={`text-xs ${isHigh ? "font-medium text-amber-500" : "text-gray-400"}`}>
                        ₩{cat.spent.toLocaleString()}만 / ₩{cat.budget.toLocaleString()}만 · {pct}%
                      </span>
                    </div>
                    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full ${isHigh ? "bg-amber-400" : cat.trackColor}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 월별 집행 추이 */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">월별 집행 추이</h2>
                <p className="text-sm text-gray-400">1월~6월 · 단위 만원</p>
              </div>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-600">
                예상 초과 +3%
              </span>
            </div>
            <div className="mt-4">
              <NxArea data={MONTHLY_TREND} height={200} unit="만" />
            </div>
          </div>
        </div>

        {/* Right: donut + AI tips */}
        <div className="flex flex-col gap-6">
          {/* 집행 비중 */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">집행 비중</h2>
              <span className="text-xs text-gray-400">{EXEC_PCT}% 사용</span>
            </div>
            <div className="mt-4 flex justify-center">
              <div className="relative h-40 w-40">
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
                  <span className="text-2xl font-bold text-gray-900">{EXEC_PCT}%</span>
                  <span className="text-xs text-gray-400">집행</span>
                </div>
              </div>
            </div>
            <ul className="mt-4 space-y-2.5">
              {CATEGORIES.map((cat) => (
                <li key={cat.label} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-600">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.label}
                  </span>
                  <span className="font-medium text-gray-900">₩{cat.spent.toLocaleString()}만</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AI 최적화 팁 */}
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-violet-50 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SparklesIcon size={16} className="text-blue-600" />
                <h2 className="text-sm font-semibold text-gray-900">AI 예산 최적화</h2>
              </div>
              <span className="text-xs text-gray-400">절감 기회 3건</span>
            </div>
            <div className="mt-3 flex flex-col gap-2.5">
              {AI_TIPS.map((tip, i) => (
                <div key={i} className="flex gap-3 rounded-lg bg-white/70 p-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${tip.iconBg}`}
                  >
                    {tip.icon}
                  </div>
                  <p className="text-xs leading-relaxed text-gray-600">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
