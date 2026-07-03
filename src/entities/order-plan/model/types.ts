// 발주 계획 도메인 — 서버 /order-plans 응답 타입 (조회 전용).
// 발주 자동계산(필요량·부족량·발주량·예상비용)은 백엔드가 산출한다.

export type OrderPlanUnit = "KG" | "G" | "L" | "ML" | "EA" | "BOX";

// GET /order-plans/{id} 의 items 원소
export interface OrderPlanItem {
  id: number;
  menuName: string; // 메뉴
  ingredientName: string; // 필요 농산물
  unit: string; // 단위 (OrderPlanUnit 이거나 기타 문자열)
  requiredQuantity: number; // 필요량
  currentStock: number; // 재고
  shortageQuantity: number; // 부족량
  orderQuantity: number; // 발주량
  supplierName: string; // 공급처
  unitPrice: number; // 단가
  estimatedCost: number; // 예상비용
  basis: string; // 근거
}

// GET /order-plans 목록 원소
export interface OrderPlanSummary {
  id: number;
  title: string;
  planDate: string;
  studentCount: number;
  createdAt: string;
}

// GET /order-plans/{id} 상세 (발주 계획표 포함)
export interface OrderPlanDetail {
  id: number;
  title: string;
  planDate: string;
  studentCount: number;
  memo: string;
  totalEstimatedCost: number; // 발주 예상비용 합계
  items: OrderPlanItem[];
  createdAt: string;
  updatedAt: string;
}
