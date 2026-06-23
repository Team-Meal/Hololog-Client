import { instance } from "@/shared/api";
import type { SignupRequestResponse } from "@/entities/auth";
import type { PageSignupRequestItem } from "../model/types";

export async function getSignupRequestsApi(
  page = 0,
  size = 20,
): Promise<PageSignupRequestItem> {
  const response = await instance.get<PageSignupRequestItem>("/admin/signup-requests", {
    params: { page, size },
    requiresAuth: true,
  });
  return response.data;
}

export async function approveSignupRequestApi(requestId: number): Promise<SignupRequestResponse> {
  const response = await instance.post<SignupRequestResponse>(
    `/admin/signup-requests/${requestId}/approve`,
    null,
    { requiresAuth: true },
  );
  return response.data;
}

export async function rejectSignupRequestApi(requestId: number): Promise<SignupRequestResponse> {
  const response = await instance.post<SignupRequestResponse>(
    `/admin/signup-requests/${requestId}/reject`,
    null,
    { requiresAuth: true },
  );
  return response.data;
}
