// Role values sent to POST /auth/signup. Nutritionists sign up directly as
// NUTRITIONIST — no license submission or admin approval step.
export type UserRole = "STUDENT" | "TEACHER" | "NUTRITIONIST";

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

// Status of a legacy nutritionist signup request (admin page only — new
// nutritionist signups no longer create requests).
export type SignupRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface SignupRequestResponse {
  requestId: number;
  licenseNumber: string;
  status: SignupRequestStatus;
}
