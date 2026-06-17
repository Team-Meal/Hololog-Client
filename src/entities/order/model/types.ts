export interface OrderItem {
  id: number;
  name: string;
  supplier: string;
  price: number;
  /** 주간 예상 소요량 (kg) */
  weeklyDemand: number;
  /** 현재 재고 (kg) */
  stock: number;
  /** AI 권장 구매량 (kg) */
  recommended: number;
  /** 권장안 적합도 (%) */
  fit: number;
  /** AI 코멘트 */
  note: string;
}

export type OrderStatTone = "neutral" | "warning" | "success";
export type OrderStatIcon = "package" | "cart" | "wallet" | "sparkles";

export interface OrderStat {
  id: string;
  label: string;
  value: string;
  unit: string;
  tag: string;
  tone: OrderStatTone;
  icon: OrderStatIcon;
}
