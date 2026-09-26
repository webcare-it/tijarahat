import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import type { QueryType } from "../utils/type";

export const useGetConfig = (): QueryType => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["get_config"],
    queryFn: async () => {
      const response = await apiClient.get("/business-settings");
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
  });

  return { data, isLoading, error };
};
