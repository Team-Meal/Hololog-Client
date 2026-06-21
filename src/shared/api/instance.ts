import axios from "axios";
import { toast } from "sonner";

export const mealApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MEAL_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

mealApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && typeof window !== "undefined") {
      const data = error.response?.data as { message?: string } | undefined;
      toast.error(data?.message ?? error.message ?? "요청을 처리하지 못했습니다.");
    }
    return Promise.reject(error);
  },
);

export default mealApi;
