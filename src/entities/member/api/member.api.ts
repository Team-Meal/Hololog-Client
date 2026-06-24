import { instance } from "@/shared/api";
import type { MemberProfile, UpdateSchoolNameRequest } from "../model/types";

// GET /members/me — 내 프로필 조회 (이름·권한·소속 학교).
export async function getMyProfile(): Promise<MemberProfile> {
  const response = await instance.get<MemberProfile>("/members/me", { requiresAuth: true });
  return response.data;
}

// PATCH /members/me/school-name — 소속 학교 수정. Returns the updated profile.
export async function updateSchoolName(schoolName: string): Promise<MemberProfile> {
  const payload: UpdateSchoolNameRequest = { schoolName };
  const response = await instance.patch<MemberProfile>("/members/me/school-name", payload, {
    requiresAuth: true,
  });
  return response.data;
}
