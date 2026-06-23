import type { SignupRequestStatus } from "@/entities/auth";

export interface SignupRequestItem {
  requestId: number;
  memberId: number;
  name: string;
  licenseNumber: string;
  status: SignupRequestStatus;
}

export interface PageSignupRequestItem {
  content: SignupRequestItem[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
