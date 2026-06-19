import { TableIcon } from "@/shared/ui";

/** 학교와 주변 공급업체 위치를 보여주는 지도 미리보기. */
export function LocationPreview() {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-(--shadow-card)">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-950">
          <TableIcon className="size-5 text-blue-600" />
          위치 미리보기
        </h2>
        <span className="text-xs font-medium text-zinc-400">반경 15km</span>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl bg-blue-50">
        <svg
          viewBox="0 0 420 205"
          role="img"
          aria-label="한빛초등학교와 공급업체 위치를 표시한 지도 미리보기"
          className="h-auto w-full"
        >
          <defs>
            <linearGradient id="supplier-map-bg" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#eef6ff" />
              <stop offset="100%" stopColor="#e8f9ed" />
            </linearGradient>
            <pattern id="supplier-map-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#cfe0ee" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="420" height="205" fill="url(#supplier-map-bg)" />
          <rect width="420" height="205" fill="url(#supplier-map-grid)" opacity="0.75" />
          <MapPin x={210} y={98} color="#22c55e" label="한빛초등학교" />
          <MapPin x={135} y={78} color="#1d6ff2" label="푸르름 농산" />
          <MapPin x={286} y={54} color="#1d6ff2" label="한울 축산" />
          <MapPin x={102} y={143} color="#1d6ff2" label="동해 수산" />
          <MapPin x={236} y={118} color="#1d6ff2" label="행복드림 베이커리" />
          <MapPin x={328} y={132} color="#1d6ff2" label="신선마루 종합식자재" />
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-500">
        <Legend color="bg-emerald-500" label="한빛초등학교" />
        <Legend color="bg-blue-600" label="공급업체 5곳" />
      </div>
    </section>
  );
}

function MapPin({ x, y, color, label }: { x: number; y: number; color: string; label: string }) {
  return (
    <g aria-label={label}>
      <circle cx={x} cy={y} r="12" fill={color} opacity="0.16" />
      <circle cx={x} cy={y} r="7" fill={color} stroke="white" strokeWidth="2" />
    </g>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={["size-3 rounded-full", color].join(" ")} />
      {label}
    </span>
  );
}
