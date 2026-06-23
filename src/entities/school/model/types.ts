// A school record sourced from the NEIS (나이스) school info open API.
export interface School {
  name: string; // SCHUL_NM
  code: string; // SD_SCHUL_CODE
  kind: string; // SCHUL_KND_SC_NM (초등학교 / 중학교 / 고등학교)
  region: string; // LCTN_SC_NM (시·도)
  address: string; // ORG_RDNMA (도로명 주소)
}
