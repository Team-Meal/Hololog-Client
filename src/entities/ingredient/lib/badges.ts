import type { IngredientItem } from "../model/types";

export type BadgeTone = "blue" | "green" | "amber" | "red" | "zinc";

export interface InventoryBadge {
  key: "local" | "seasonal" | "expiring";
  label: string;
  tone: BadgeTone;
}

const MS_PER_DAY = 86_400_000;
/** 유통기한 임박 기준(일) — 이 값 이하로 남으면 '임박' 뱃지 */
export const EXPIRY_SOON_DAYS = 3;

/**
 * 오늘부터 유통기한까지 남은 일수(자정 기준). 음수면 이미 경과.
 * 유통기한이 없거나 파싱 불가하면 null.
 */
export function daysUntilExpiry(expirationDate: string | undefined, now: Date): number | null {
  if (!expirationDate) return null;
  const exp = new Date(expirationDate);
  if (Number.isNaN(exp.getTime())) return null;
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const target = Date.UTC(exp.getFullYear(), exp.getMonth(), exp.getDate());
  return Math.round((target - today) / MS_PER_DAY);
}

/** 품목명 키워드 → 제철 월(1~12) 목록. 농산물 중심의 국내 제철 기준. */
const SEASON_TABLE: Array<{ keywords: string[]; months: number[] }> = [
  { keywords: ["딸기"], months: [1, 2, 3, 4, 12] },
  { keywords: ["시금치"], months: [1, 2, 3, 11, 12] },
  { keywords: ["봄동", "냉이", "달래"], months: [2, 3, 4] },
  { keywords: ["양배추"], months: [3, 4, 5, 11, 12] },
  { keywords: ["감자"], months: [5, 6, 7] },
  { keywords: ["오이"], months: [5, 6, 7, 8] },
  { keywords: ["토마토", "방울토마토"], months: [6, 7, 8, 9] },
  { keywords: ["애호박", "호박"], months: [6, 7, 8, 9] },
  { keywords: ["가지"], months: [7, 8, 9] },
  { keywords: ["옥수수"], months: [7, 8] },
  { keywords: ["고구마"], months: [9, 10, 11] },
  { keywords: ["배추", "무"], months: [10, 11, 12] },
  { keywords: ["대파", "파"], months: [11, 12, 1, 2] },
  { keywords: ["사과"], months: [9, 10, 11] },
  { keywords: ["배"], months: [9, 10, 11] },
  { keywords: ["귤", "감귤"], months: [11, 12, 1] },
  { keywords: ["버섯", "표고"], months: [9, 10, 11] },
];

/** 해당 품목이 주어진 월(1~12)에 제철인지 판별. */
export function isInSeason(name: string, month: number): boolean {
  return SEASON_TABLE.some(
    (entry) => entry.months.includes(month) && entry.keywords.some((k) => name.includes(k)),
  );
}

const IMPORTED_PATTERN = /(수입|외국|중국|미국|호주|베트남|칠레|노르웨이|러시아|태국|필리핀|에콰도르)/;

/** 원산지가 지역(국내)산인지 판별. 원산지 정보가 없으면 false. */
export function isLocalOrigin(origin: string | undefined): boolean {
  if (!origin || origin.trim() === "") return false;
  return !IMPORTED_PATTERN.test(origin);
}

/**
 * 재고 항목에 표시할 뱃지 목록을 산출.
 * - 지역: 원산지가 국내산 (원산지 데이터 있을 때만)
 * - 제철: 현재 월 기준 제철 품목
 * - 임박: 유통기한이 EXPIRY_SOON_DAYS일 이내 또는 경과
 */
export function getInventoryBadges(item: IngredientItem, now: Date): InventoryBadge[] {
  const badges: InventoryBadge[] = [];

  if (isLocalOrigin(item.origin)) {
    badges.push({ key: "local", label: "지역", tone: "green" });
  }

  if (isInSeason(item.name, now.getMonth() + 1)) {
    badges.push({ key: "seasonal", label: "제철", tone: "blue" });
  }

  const days = daysUntilExpiry(item.expirationDate, now);
  if (days !== null && days <= EXPIRY_SOON_DAYS) {
    badges.push({
      key: "expiring",
      label: days < 0 ? "기한경과" : "임박",
      tone: days < 0 ? "red" : "amber",
    });
  }

  return badges;
}
