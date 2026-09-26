import { apiClient } from "@/lib/api-client";
import type { UserType } from "@/type";
import { useQuery } from "@tanstack/react-query";
import { apiErrorHandler } from "../utils/error";

export const useGetUserQuery = (): {
  data: { user: UserType };
  isLoading: boolean;
  error: unknown;
} => {
  const token = localStorage.getItem("token");

  const { data, isLoading, error } = useQuery({
    queryKey: ["get_user"],
    queryFn: async () => {
      const response = await apiClient.get("/auth/user");

      if (response?.data?.id) {
        localStorage.setItem("user_id", response?.data?.id);
      }
      return response.data;
    },
    enabled: !!token,
    staleTime: 0,
    gcTime: 0,
    retry: (failureCount, error: unknown) => {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          return false;
        }
      }
      return failureCount < 3;
    },
  });

  if (error !== null) {
    apiErrorHandler(error);
  }

  return { data, isLoading, error };
};
