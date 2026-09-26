import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../lib/api-client";
import type { CategoryType } from "@/components/layout/header/useMenu";
import type { BrandType } from "@/type";

interface UtilityType {
    data: {
        data: {
            categories: { data: CategoryType[] };
            brands: { data: BrandType[] };
            suggestions: {
                id: string;
                query: string;
                count: number;
                type: string;
                type_string: string;
            }[];
        };
    };
    error: unknown;
    isLoading: boolean;
}

export const useAllUtility = (): UtilityType => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["all_utility"],
        queryFn: async () => {
            const response = await apiClient.get("/all-utility");
            return response.data;
        },
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        retry: 3,
    });

    return { data, isLoading, error };
};
