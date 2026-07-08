import { NextResponse } from "next/server";
import type { PriceListResponse, PriceQuoteRaw, PriceSource } from "@/entities/price/model/types";

const KAMIS_BASE_URL = "http://www.kamis.or.kr/service/price/xml.do";

// KAMIS 품목/부류/등급 코드 — 발급받은 인증키로 실제 조회해 KAMIS Open API
// 문서(https://www.kamis.or.kr/customer/reference/openapi_list.do) 기준으로 검증 필요.
// 소매(p_product_cls_code=01) 기준, 국산(p_country_code=1101) 상품.
const KAMIS_ITEM_CODE_MAP: Record<
  string,
  { itemCategoryCode: string; itemCode: string; kindCode: string }
> = {
  감자: { itemCategoryCode: "100", itemCode: "152", kindCode: "01" },
  양파: { itemCategoryCode: "200", itemCode: "245", kindCode: "00" },
  당근: { itemCategoryCode: "200", itemCode: "253", kindCode: "00" },
  오이: { itemCategoryCode: "200", itemCode: "212", kindCode: "00" },
  토마토: { itemCategoryCode: "200", itemCode: "215", kindCode: "00" },
  배추: { itemCategoryCode: "200", itemCode: "211", kindCode: "00" },
  수박: { itemCategoryCode: "400", itemCode: "418", kindCode: "00" },
  대파: { itemCategoryCode: "200", itemCode: "246", kindCode: "00" },
};

const FETCH_TIMEOUT_MS = 5000;

async function fetchKamisItem(
  itemName: string,
  certKey: string,
  certId: string,
): Promise<PriceQuoteRaw | null> {
  const codes = KAMIS_ITEM_CODE_MAP[itemName];
  if (!codes) return null;

  const params = new URLSearchParams({
    action: "dailySalesList",
    p_cert_key: certKey,
    p_cert_id: certId,
    p_returntype: "json",
    p_product_cls_code: "01",
    p_item_category_code: codes.itemCategoryCode,
    p_item_code: codes.itemCode,
    p_kind_code: codes.kindCode,
    p_country_code: "1101",
    p_convert_kg_yn: "Y",
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(`${KAMIS_BASE_URL}?${params.toString()}`, {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;

    const data = await response.json();
    const rows: Array<{ price?: string; dpr1?: string }> = Array.isArray(data?.price)
      ? data.price
      : Array.isArray(data?.data?.item)
        ? data.data.item
        : [];
    const raw = rows[0];
    const price = Number(raw?.price ?? raw?.dpr1);
    if (!raw || !Number.isFinite(price) || price <= 0) return null;

    // 기간별(전주 대비) 조회는 아직 붙이지 않아 실제 이력값이 없다 — price를 그대로
    // baselinePrice로 채워 "변동 없음"으로 나오게 한다. 가짜 증감률을 만들지 않기 위함.
    return { itemName, unit: "kg", price, baselinePrice: price };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  const certKey = process.env.KAMIS_CERT_KEY;
  const certId = process.env.KAMIS_CERT_ID;

  if (!certKey || !certId) {
    return NextResponse.json<PriceListResponse>({
      items: [],
      source: "unavailable",
      fetchedAt: new Date().toISOString(),
    });
  }

  const itemNames = Object.keys(KAMIS_ITEM_CODE_MAP);
  const results = await Promise.all(
    itemNames.map((itemName) => fetchKamisItem(itemName, certKey, certId)),
  );

  // 서버가 실제로 응답한 품목만 내려준다 — 조회 실패 품목은 목록에서 제외(대체값 없음).
  const items: PriceQuoteRaw[] = results.filter(
    (result): result is PriceQuoteRaw => result !== null,
  );

  const source: PriceSource =
    items.length === 0 ? "unavailable" : items.length === itemNames.length ? "kamis" : "partial";

  return NextResponse.json<PriceListResponse>({
    items,
    source,
    fetchedAt: new Date().toISOString(),
  });
}
