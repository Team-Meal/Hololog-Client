import { StatusBadge, SurfaceCard } from "@/shared/ui";

interface StockItem {
  name: string;
  amount: string;
  ratio: number;
  tone: "red" | "orange";
}

const ITEMS: StockItem[] = [
  { name: "양파", amount: "32 kg", ratio: 18, tone: "red" },
  { name: "식용유", amount: "18 L", ratio: 12, tone: "red" },
  { name: "검정콩", amount: "26 kg", ratio: 34, tone: "orange" },
  { name: "체다치즈", amount: "12 개", ratio: 22, tone: "orange" },
];

const toneClass: Record<StockItem["tone"], string> = {
  red: "bg-red-500",
  orange: "bg-amber-500",
};

export function LowStock() {
  return (
    <SurfaceCard>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-zinc-950">재고 부족</p>
        <StatusBadge tone="red">6 품목</StatusBadge>
      </div>

      <ul className="mt-4 space-y-3.5">
        {ITEMS.map((item) => (
          <li key={item.name}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-zinc-600">{item.name}</span>
              <span className="font-semibold text-zinc-950">{item.amount}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
              <div
                className={`h-full rounded-full ${toneClass[item.tone]}`}
                style={{ width: `${item.ratio}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </SurfaceCard>
  );
}
