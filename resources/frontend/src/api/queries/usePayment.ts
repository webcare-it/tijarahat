import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import type { QueryType } from "../utils/type";

export const usePaymentMethods = (): QueryType => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["payment_methods"],
    queryFn: async () => {
      const response = await apiClient.get("/payment-types");
      return response.data;
    },
  });

  return { data, isLoading, error };
};
