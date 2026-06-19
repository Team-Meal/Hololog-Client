import type { Supplier } from "../model/types";

/** 공급업체를 나타내는 머리글자 마크. 카드·비교표에서 공용으로 쓴다. */
export function SupplierMark({
  supplier,
  compact = false,
}: {
  supplier: Supplier;
  compact?: boolean;
}) {
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
