import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { getUserId } from "@/helper";

export const useGetDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["get_dashboard"],
    queryFn: async () => {
      const response = await apiClient.get(
        `/customer/dashboard-summary/${getUserId()}`
      );
      return response.data;
    },
    enabled: !!getUserId(),
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
  });

  return { data, isLoading, error };
};
