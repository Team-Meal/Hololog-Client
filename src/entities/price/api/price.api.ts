import { FALLBACK_PRICE_SNAPSHOT } from "../lib/fallback-snapshot";
import { getSubstitutes } from "../lib/substitutes";
import { computeChangeRatePercent, isSpiking } from "../lib/spike";
import type { PriceListResponse, PriceQuote, PriceQuoteRaw, PriceSource } from "../model/types";

function enrich(raw: PriceQuoteRaw, source: PriceSource): PriceQuote {
  const changeRatePercent = computeChangeRatePercent(raw.price, raw.baselinePrice);
  return {
    ...raw,
    changeRatePercent,
    isSpiking: isSpiking(changeRatePercent),
    substituteItems: getSubstitutes(raw.itemName),
    source,
  };
}

// 자체 Next 라우트(/api/kamis/prices)를 호출 — 백엔드용 axios instance가 아니라
// 일반 fetch를 쓴다(entities/school의 searchSchools와 동일한 패턴).
export async function getPricesApi(): Promise<{ items: PriceQuote[]; source: PriceSource }> {
  try {
    const response = await fetch("/api/kamis/prices");
    if (!response.ok) throw new Error("가격 정보를 불러오지 못했습니다.");

    const data = (await response.json()) as PriceListResponse;
    return { items: data.items.map((item) => enrich(item, data.source)), source: data.source };
  } catch {
    return {
      items: FALLBACK_PRICE_SNAPSHOT.map((item) => enrich(item, "fallback")),
      source: "fallback",
    };
  }
}
