import { instance } from "@/shared/api";
import type {
  LoginCredentials,
  RegisterCredentials,
  SigninResponse,
  SignupRequestPayload,
  SignupRequestResponse,
} from "@/entities/auth";

export async function loginApi(credentials: LoginCredentials): Promise<SigninResponse> {
  const response = await instance.post<SigninResponse>("/auth/signin", credentials);
  return response.data;
}

// Returns 204 No Content — no tokens are issued, the user must sign in afterwards.
export async function registerApi(credentials: RegisterCredentials): Promise<void> {
  await instance.post("/auth/signup", credentials);
}

// Submits a license number for nutritionist approval. Requires a signed-in
// PENDING_NUTRITIONIST (Bearer token), so the caller must sign in beforehand.
export async function submitSignupRequestApi(
  payload: SignupRequestPayload,
): Promise<SignupRequestResponse> {
  const response = await instance.post<SignupRequestResponse>("/auth/signup-requests", payload, {
    requiresAuth: true,
  });
  return response.data;
}

// Deletes the server-side refresh token. Returns 204; local tokens are cleared by the caller.
// Token reissue (POST /auth/reissue) is handled automatically by the axios 401 interceptor.
export async function logoutApi(): Promise<void> {
  await instance.post("/auth/logout", null, { requiresAuth: true });
}
