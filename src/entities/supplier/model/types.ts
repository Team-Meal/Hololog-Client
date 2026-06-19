export interface Supplier {
  id: number;
  name: string;
  category: string;
  /** 학교로부터의 거리 */
  distance: string;
  rating: number;
  reviews: number;
  /** 단가 수준 (낮음·보통·약간 높음) */
  price: string;
  /** 배송 가능 시점 (당일·익일) */
  delivery: string;
  /** AI 추천 업체 여부 */
  recommended: boolean;
  /** 마크 배경색 클래스 */
  accent: string;
  /** 마크에 표시할 한 글자 */
  initial: string;
}
