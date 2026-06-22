import { type NextRequest, NextResponse } from "next/server";
import type { School } from "@/entities/school";

const NEIS_SCHOOL_INFO_URL = "https://open.neis.go.kr/hub/schoolInfo";

interface NeisRow {
  SCHUL_NM?: string;
  SD_SCHUL_CODE?: string;
  SCHUL_KND_SC_NM?: string;
  LCTN_SC_NM?: string;
  ORG_RDNMA?: string;
}

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name")?.trim();
  if (!name) return NextResponse.json<School[]>([]);

  const params = new URLSearchParams({
    Type: "json",
    pIndex: "1",
    pSize: "15",
    SCHUL_NM: name,
  });
  // Optional API key — NEIS works keyless with limits, a key raises them.
  const key = process.env.NEIS_API_KEY;
  if (key) params.set("KEY", key);

  let rows: NeisRow[] = [];
  try {
    const response = await fetch(`${NEIS_SCHOOL_INFO_URL}?${params.toString()}`, {
      // Cache identical queries for an hour to stay within NEIS rate limits.
      next: { revalidate: 3600 },
    });
    if (response.ok) {
      const data = await response.json();
      // Shape: { schoolInfo: [ { head: [...] }, { row: [...] } ] }; absent when no match.
      rows = data?.schoolInfo?.[1]?.row ?? [];
    }
  } catch {
    rows = [];
  }

  const schools: School[] = rows.map((row) => ({
    name: row.SCHUL_NM ?? "",
    code: row.SD_SCHUL_CODE ?? "",
    kind: row.SCHUL_KND_SC_NM ?? "",
    region: row.LCTN_SC_NM ?? "",
    address: row.ORG_RDNMA?.trim() ?? "",
  }));

  return NextResponse.json(schools);
}
