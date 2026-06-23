import { instance } from "@/shared/api";
import type {
  LoginCredentials,
  RegisterCredentials,
  SigninResponse,
} from "@/entities/auth";

export async function loginApi(credentials: LoginCredentials): Promise<SigninResponse> {
  const response = await instance.post<SigninResponse>("/auth/signin", credentials);
  return response.data;
}

// Returns 204 No Content — no tokens are issued, the user must sign in afterwards.
export async function registerApi(credentials: RegisterCredentials): Promise<void> {
  await instance.post("/auth/signup", credentials);
}
