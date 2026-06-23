// Role values sent to POST /auth/signup. Nutritionists sign up as PENDING_NUTRITIONIST
// and are promoted to NUTRITIONIST after submitting a license number (/auth/signup-requests)
// and admin approval.
export type UserRole = "STUDENT" | "TEACHER" | "PENDING_NUTRITIONIST";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  role: UserRole;
  email: string;
  name: string;
  schoolName: string;
  password: string;
}

export interface SigninResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
  role: string;
}
