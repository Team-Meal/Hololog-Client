import type { MemberRole } from "../model/types";

const ROLE_LABELS: Record<MemberRole, string> = {
  ADMIN: "관리자",
  STUDENT: "학생",
  TEACHER: "교사",
  PENDING_NUTRITIONIST: "영양사 (승인 대기)",
  NUTRITIONIST: "영양교사",
};

// Korean display label for a member role.
export function roleLabel(role: MemberRole): string {
  return ROLE_LABELS[role] ?? role;
}
