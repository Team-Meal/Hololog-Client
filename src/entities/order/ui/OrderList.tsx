import type { ReactNode } from "react";

import { OrderCard } from "./OrderCard";
import type { OrderItem } from "../model/types";

/**
 * 품목별 권장 발주 카드를 세로로 나열한다.
 * 각 카드의 액션은 `renderActions`로 주입받아 features 계층과 분리한다.
 */
export function OrderList({
  items,
  renderActions,
}: {
  items: OrderItem[];
  renderActions?: (item: OrderItem) => ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <OrderCard key={item.id} item={item} actions={renderActions?.(item)} />
      ))}
    </div>
  );
}
