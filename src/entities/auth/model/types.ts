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

// Status of a nutritionist signup request. New requests come back as PENDING.
export type SignupRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

// Body for POST /auth/signup-requests — submitted by a PENDING_NUTRITIONIST.
export interface SignupRequestPayload {
  licenseNumber: string;
}

export interface SignupRequestResponse {
  requestId: number;
  licenseNumber: string;
  status: SignupRequestStatus;
}
