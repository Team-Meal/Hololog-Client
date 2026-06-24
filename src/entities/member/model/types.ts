// Role of the logged-in member, as returned by GET /members/me.
export type MemberRole = "ADMIN" | "STUDENT" | "TEACHER" | "PENDING_NUTRITIONIST" | "NUTRITIONIST";

// GET /members/me — 내 프로필.
export interface MemberProfile {
  name: string;
  role: MemberRole;
  schoolName: string;
}

// Body for PATCH /members/me/school-name — 소속 학교 수정.
export interface UpdateSchoolNameRequest {
  schoolName: string; // max 255 chars
}
