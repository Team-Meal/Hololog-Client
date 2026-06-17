import { api } from "@/shared/api";
import type { LoginCredentials, LoginResponse } from "@/entities/auth";

export async function loginApi(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", credentials);
  return response.data;
}
