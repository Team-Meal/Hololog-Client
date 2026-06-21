import { instance } from "@/shared/api";
import type {
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  RegisterResponse,
} from "@/entities/auth";

export async function loginApi(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await instance.post<LoginResponse>("/auth/login", credentials);
  return response.data;
}

export async function registerApi(
  credentials: RegisterCredentials,
): Promise<RegisterResponse> {
  const response = await instance.post<RegisterResponse>("/auth/signup", credentials);
  return response.data;
}
