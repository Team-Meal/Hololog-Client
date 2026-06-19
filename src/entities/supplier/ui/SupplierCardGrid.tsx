import type { ReactNode } from "react";

import { SupplierCard } from "./SupplierCard";
import type { Supplier } from "../model/types";

/**
 * 공급업체 카드를 2열 그리드로 나열한다.
 * 각 카드의 액션은 `renderActions`로 주입받아 features 계층과 분리한다.
 */
export function SupplierCardGrid({
  suppliers,
  renderActions,
}: {
  suppliers: Supplier[];
  renderActions?: (supplier: Supplier) => ReactNode;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {suppliers.map((supplier) => (
        <SupplierCard key={supplier.id} supplier={supplier} actions={renderActions?.(supplier)} />
      ))}
    </div>
  );
}
