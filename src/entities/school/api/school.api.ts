import type { School } from "../model/types";

// Queries our /api/neis route, which proxies and normalizes the NEIS school info API.
export async function searchSchools(name: string): Promise<School[]> {
  const query = name.trim();
  if (query.length === 0) return [];

  const params = new URLSearchParams({ name: query });
  const response = await fetch(`/api/neis/schools?${params.toString()}`);
  if (!response.ok) return [];

  return (await response.json()) as School[];
}
