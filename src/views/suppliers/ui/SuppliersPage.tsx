"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button, ShoppingCartIcon, SparklesIcon, TableIcon } from "@/shared/ui";

type ViewMode = "cards" | "compare";

interface Supplier {
  id: number;
  name: string;
  category: string;
  distance: string;
  rating: number;
  reviews: number;
  price: string;
  delivery: string;
  recommended: boolean;
  accent: string;
  initial: string;
}

const suppliers: Supplier[] = [
  {
    id: 1,
    name: "푸르름 농산",
    category: "채소·과일",
    distance: "4.2 km",
    rating: 4.8,
    reviews: 214,
    price: "보통",
    delivery: "당일",
    recommended: true,
    accent: "bg-emerald-500",
    initial: "푸",
  },
  {
    id: 2,
    name: "한울 축산",
    category: "육류",
    distance: "7.8 km",
    rating: 4.7,
    reviews: 168,
    price: "약간 높음",
    delivery: "익일",
    recommended: true,
    accent: "bg-red-500",
    initial: "한",
  },
  {
    id: 3,
    name: "동해 수산",
    category: "수산물",
    distance: "12.4 km",
    rating: 4.5,
    reviews: 96,
    price: "보통",
    delivery: "익일",
    recommended: false,
    accent: "bg-blue-600",
    initial: "동",
  },
  {
    id: 4,
    name: "행복드림 베이커리",
    category: "제과·제빵",
    distance: "3.1 km",
    rating: 4.6,
    reviews: 142,
    price: "낮음",
    delivery: "당일",
    recommended: false,
    accent: "bg-amber-500",
    initial: "행",
  },
  {
    id: 5,
    name: "신선마루 종합식자재",
    category: "종합",
    distance: "9.5 km",
    rating: 4.4,
    reviews: 320,
    price: "낮음",
    delivery: "익일",
    recommended: false,
    accent: "bg-violet-500",
    initial: "신",
  },
];

export function SuppliersPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  const handleOrder = (supplierName: string) => {
    toast.success(`${supplierName} 발주가 생성되었습니다.`);
  };

  return (
    <main className="min-h-full bg-[#f4f4f6] text-gray-900">
      <SupplierPageAnimations />
<section className="mx-auto flex w-full max-w-360 flex-col gap-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">공급업체</p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal text-gray-950 sm:text-4xl">
              공급업체 추천
            </h1>
            <p className="mt-2 text-sm font-medium text-gray-500">
              거리·평점·단가·배송 가능 여부를 비교해 최적의 공급업체를 찾으세요.
            </p>
          </div>

          <div className="inline-flex w-full rounded-2xl bg-gray-200/70 p-1 sm:w-auto">
            <ViewToggleButton selected={viewMode === "cards"} onClick={() => setViewMode("cards")}>
              카드
            </ViewToggleButton>
            <ViewToggleButton
              selected={viewMode === "compare"}
              onClick={() => setViewMode("compare")}
            >
              비교
            </ViewToggleButton>
          </div>
        </header>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_405px]">
          <section className="min-w-0">
            <div
              key={viewMode}
              className="animate-[supplierViewIn_220ms_ease-out] motion-reduce:animate-none"
            >
              {viewMode === "cards" ? (
                <SupplierCardGrid suppliers={suppliers} onOrder={handleOrder} />
              ) : (
                <SupplierCompareTable suppliers={suppliers} />
              )}
            </div>
          </section>

          <aside className="flex flex-col gap-5">
            <LocationPreview />
            <RecommendationSummary />
          </aside>
        </div>
      </section>
    </main>
  );
}

function ViewToggleButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-9 flex-1 rounded-xl px-5 text-sm font-semibold transition-all duration-200 ease-out sm:flex-none",
        selected
          ? "scale-[1.02] bg-white text-gray-950 shadow-sm"
          : "text-gray-500 hover:bg-white/40 hover:text-gray-800",
      ].join(" ")}
      aria-pressed={selected}
    >
      {children}
    </button>
  );
}

function SupplierCardGrid({
  suppliers,
  onOrder,
}: {
  suppliers: Supplier[];
  onOrder: (supplierName: string) => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {suppliers.map((supplier) => (
        <SupplierCard key={supplier.id} supplier={supplier} onOrder={onOrder} />
      ))}
    </div>
  );
}

function SupplierCard({
  supplier,
  onOrder,
}: {
  supplier: Supplier;
  onOrder: (supplierName: string) => void;
}) {
  return (
    <article
      className={[
        "rounded-[24px] border border-transparent bg-white p-5 shadow-[0_1px_0_rgba(15,23,42,0.02)]",
        "transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-sm",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <SupplierMark supplier={supplier} />
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-gray-950">{supplier.name}</h2>
            <p className="mt-1 text-sm font-medium text-gray-400">{supplier.category}</p>
          </div>
        </div>
        {supplier.recommended && <AiBadge />}
      </div>

      <dl className="mt-5 grid grid-cols-4 gap-3">
        <SupplierMetric label="거리" value={supplier.distance} />
        <SupplierMetric label="평점" value={supplier.rating.toFixed(1)} featured />
        <SupplierMetric label="단가" value={supplier.price} />
        <SupplierMetric label="배송" value={supplier.delivery} />
      </dl>

      <div className="mt-5 grid grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] gap-3">
        <Button variant="ghost" className="h-10 text-gray-800 hover:bg-gray-100">
          <MessageIcon className="size-4" />
          문의
        </Button>
        <Button
          variant="primary"
          className="h-10 rounded-lg bg-blue-600 font-bold transition-all duration-200 hover:bg-blue-700 active:scale-[0.98]"
          onClick={() => onOrder(supplier.name)}
        >
          <ShoppingCartIcon className="size-4" />
          발주
        </Button>
      </div>
    </article>
  );
}

function SupplierCompareTable({ suppliers }: { suppliers: Supplier[] }) {
  return (
    <div className="rounded-[24px] bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
      <h2 className="text-lg font-bold text-gray-950">공급업체 비교</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400">
              <th className="py-4 pr-4">공급업체</th>
              <th className="px-4 py-4">카테고리</th>
              <th className="px-4 py-4">거리</th>
              <th className="px-4 py-4">평점</th>
              <th className="px-4 py-4">단가</th>
              <th className="px-4 py-4">배송</th>
              <th className="py-4 pl-4 text-right">선택</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <SupplierCompareRow key={supplier.id} supplier={supplier} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SupplierCompareRow({ supplier }: { supplier: Supplier }) {
  return (
    <tr className="border-b border-gray-100 transition-colors duration-150 hover:bg-blue-50/35 last:border-0">
      <td className="py-4 pr-4">
        <div className="flex items-center gap-3">
          <SupplierMark supplier={supplier} compact />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-950">{supplier.name}</span>
              {supplier.recommended && (
                <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600">
                  추천
                </span>
              )}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-sm font-medium text-gray-500">{supplier.category}</td>
      <td className="px-4 py-4 text-sm font-medium text-gray-600">{supplier.distance}</td>
      <td className="px-4 py-4 text-sm font-medium text-gray-600">
        {supplier.rating.toFixed(1)} ({supplier.reviews})
      </td>
      <td className="px-4 py-4 text-sm font-medium text-gray-600">{supplier.price}</td>
      <td className="px-4 py-4">
        <DeliveryBadge delivery={supplier.delivery} />
      </td>
      <td className="py-4 pl-4 text-right">
        <Button variant="ghost" size="sm" className="font-bold text-gray-900">
          선택
        </Button>
      </td>
    </tr>
  );
}

function SupplierMark({ supplier, compact = false }: { supplier: Supplier; compact?: boolean }) {
  return (
    <div
      className={[
        "flex shrink-0 items-center justify-center rounded-xl font-bold text-white",
        compact ? "size-9 text-sm" : "size-12 text-lg",
        supplier.accent,
      ].join(" ")}
    >
      {supplier.initial}
    </div>
  );
}

function SupplierMetric({
  label,
  value,
  featured = false,
}: {
  label: string;
  value: string;
  featured?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold text-gray-400">{label}</dt>
      <dd className="mt-2 flex min-h-6 items-center gap-1 text-sm font-bold text-gray-950">
        {featured && <span className="text-lg leading-none text-amber-400">★</span>}
        {value}
      </dd>
    </div>
  );
}

function AiBadge() {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
      <SparklesIcon className="size-3.5" />
      AI 추천
    </span>
  );
}

function DeliveryBadge({ delivery }: { delivery: string }) {
  const sameDay = delivery === "당일";

  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1 text-xs font-bold",
        sameDay ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500",
      ].join(" ")}
    >
      {delivery}
    </span>
  );
}

function LocationPreview() {
  return (
    <section className="rounded-[24px] bg-white p-5 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-950">
          <TableIcon className="size-5 text-blue-600" />
          위치 미리보기
        </h2>
        <span className="text-xs font-medium text-gray-400">반경 15km</span>
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

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500">
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

function RecommendationSummary() {
  return (
    <section className="rounded-[24px] bg-white p-5 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
      <h2 className="text-lg font-bold text-gray-950">추천 요약</h2>
      <div className="mt-4 flex gap-3 rounded-xl bg-blue-50 p-4 text-sm font-medium text-gray-600">
        <SparklesIcon className="mt-0.5 size-5 shrink-0 text-gray-500" />
        <p>
          채소·과일은 거리와 평점이 우수한 <strong className="text-gray-900">푸르름 농산</strong>
          을, 육류는 품질 평점이 높은 <strong className="text-gray-900">한울 축산</strong>을
          추천해요.
        </p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <SummaryStat label="추천" value="2곳" />
        <SummaryStat label="당일배송" value="2곳" />
        <SummaryStat label="평균평점" value="4.6" />
      </div>
    </section>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 px-3 py-3">
      <p className="text-xs font-semibold text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-gray-950">{value}</p>
    </div>
  );
}

function MessageIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.3 9.5 9.5 0 0 1-4-.9L3 20l1.2-4.2A8.1 8.1 0 0 1 3 11.5 8.4 8.4 0 0 1 12 3.2a8.4 8.4 0 0 1 9 8.3Z" />
    </svg>
  );
}

function SupplierPageAnimations() {
  return (
    <style>{`
      @keyframes supplierViewIn {
        from {
          opacity: 0;
          transform: translateY(8px) scale(0.99);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `}</style>
  );
}
