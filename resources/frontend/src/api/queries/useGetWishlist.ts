import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import type { QueryType } from "../utils/type";
import { getUserId, isAuthenticated } from "@/helper";

export const useGetWishlistQuery = (): QueryType => {
  const userId = getUserId();
  const { data, isLoading, error } = useQuery({
    queryKey: ["get_wishlist"],
    queryFn: async () => {
      const response = await apiClient.get(`/wishlists/${userId}`);
      return response.data;
    },
    enabled: !!isAuthenticated(),
    staleTime: 0,
    gcTime: 0,
  });

  return { data, isLoading, error };
};
