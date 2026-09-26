import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import type { FlashDealType, ProductType } from "@/type";

interface HomeType {
    data: {
        best_selling: { data: ProductType[] | [] };
        featured: { data: ProductType[] | [] };
        flash_deal: { data: FlashDealType[] | [] };
        todays_deal: { data: ProductType[] | [] };
        new_arrivals: { data: ProductType[] | [] };
        category_products: {
            categoryId: string;
            name: string;
            products: { data: ProductType[] };
            hasProducts: boolean;
            isLoading: boolean;
        }[];
    };
    sectionLoading: boolean;
    isError: unknown;
}

export const useGetHomeProducts = (): HomeType => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["get_home_products_for_home"],
        queryFn: async () => {
            const response = await apiClient.get(`/home/products`);
            return response.data;
        },
    });

    return { data, sectionLoading: isLoading, isError: error };
};
