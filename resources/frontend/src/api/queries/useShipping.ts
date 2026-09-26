import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import type { QueryType } from "../utils/type";

export const useShippingCost = (): QueryType => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["shipping_cost"],
    queryFn: async () => {
      const response = await apiClient.get("/shipping-cost");
      return response.data;
    },
  });

  return { data, isLoading, error };
};
