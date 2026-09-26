import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export const useGetAllBrands = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["get_all_brands"],
        queryFn: async () => {
            const response = await apiClient.get(`/brands`);
            return response.data;
        },
    });

    return { data, isLoading, error };
};
