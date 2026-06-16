interface StockItem {
  name: string;
  amount: string;
  ratio: number; // 0~100 (현재고 / 권장량)
  tone: "red" | "orange";
}

// 퍼블리싱용 mock 데이터
const ITEMS: StockItem[] = [
  { name: "현미", amount: "32 kg", ratio: 18, tone: "red" },
  { name: "식용유", amount: "18 L", ratio: 12, tone: "red" },
  { name: "검은콩", amount: "26 kg", ratio: 34, tone: "orange" },
  { name: "체다치즈", amount: "12 개", ratio: 22, tone: "orange" },
];

const toneClass: Record<StockItem["tone"], string> = {
  red: "bg-red-500",
  orange: "bg-amber-500",
};

export function LowStock() {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">재고 부족</p>
        <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
          6 품목
        </span>
      </div>

      {/* Bars */}
      <ul className="mt-4 space-y-3.5">
        {ITEMS.map((item) => (
          <li key={item.name}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-gray-600">{item.name}</span>
              <span className="font-medium text-gray-900">{item.amount}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full ${toneClass[item.tone]}`}
                style={{ width: `${item.ratio}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
