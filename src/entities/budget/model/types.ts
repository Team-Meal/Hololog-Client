// A budget record from GET /budgets. Amounts are in KRW (원).
export interface Budget {
  id: number;
  title: string;
  totalAmount: number;
  usedAmount: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  createdAt: string;
  updatedAt: string;
}
