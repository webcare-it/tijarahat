import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import type { QueryType } from "../utils/type";
import { useNavigate, useParams } from "react-router-dom";
import type { FlashDealType, ProductType } from "@/type";

export const useGetProductsForHome = (
    type: string,
    params: Record<string, unknown> = {},
): QueryType => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["get_products_for_home", type, params],
        queryFn: async () => {
            const response = await apiClient.get(`/products/${type}`, {
                params,
            });
            return response.data;
        },
    });

    return { data, isLoading, error };
};

interface FlashDealResponse {
    data: {
        flash_deal: { data: FlashDealType[] };
        products: { data: ProductType[] };
    };
    isLoading: boolean;
    error: unknown;
}

export const useGetProductsByFlashDeal = (): FlashDealResponse => {
    const navigate = useNavigate();
    const { id } = useParams();
    if (!id) navigate("/");

    const { data, isLoading, error } = useQuery({
        queryKey: ["get_products_by_flash_deal", id],
        queryFn: async () => {
            const response = await apiClient.get(`/flash-deal-products/${id}`);
            return response.data;
        },
    });

    return { data, isLoading, error };
};

export const useGetCategoryProductsForHome = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["get_category_products_for_home"],
        queryFn: async () => {
            const response = await apiClient.get(`/home/categories/products`);
            return response.data;
        },
    });

    return { data, isLoading, error };
};

export const useGetProductsByCategory = (
    id: string,
    filters: Record<string, unknown>,
): QueryType => {
    const navigate = useNavigate();

    if (!id) navigate("/");

    const { data, isLoading, error } = useQuery({
        queryKey: ["get_products_by_category", JSON.stringify({ id, filters })],
        queryFn: async () => {
            const response = await apiClient.get(`/products/category/${id}`, {
                params: filters,
            });
            return response.data;
        },
    });

    return { data, isLoading, error };
};

interface ProductsResponse {
    data: {
        data?: unknown;
        meta?: unknown;
    };
    error: unknown;
    isLoading: boolean;
    isFetching: boolean;
}

export const useGetAllProducts = (
    filters: Record<string, unknown>,
): ProductsResponse => {
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["get_all_products", JSON.stringify(filters)],
        queryFn: async () => {
            const response = await apiClient.get("/products/home", {
                params: filters,
            });
            return response.data;
        },
    });

    return { data, isLoading, error, isFetching };
};

export const useGetHighlightProducts = (
    filters: Record<string, unknown>,
): ProductsResponse => {
    const { slug } = useParams();
    const navigate = useNavigate();
    if (!slug) navigate("/products");

    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["get_highlight_products", JSON.stringify({ filters, slug })],
        queryFn: async () => {
            const response = await apiClient.get(
                `/products/highlights/${slug}`,
                {
                    params: filters,
                },
            );
            return response.data;
        },
    });

    return { data, isLoading, error, isFetching };
};

export const useGetProductDetails = (id: string): QueryType => {
    const navigate = useNavigate();
    const { data, isLoading, error } = useQuery({
        queryKey: ["get_product_details", id],
        queryFn: async () => {
            const response = await apiClient.get(`/products/${id}`);
            return response.data;
        },
    });

    if (!id) navigate("/");
    return { data, isLoading, error };
};

export const useGetRelatedProducts = (): QueryType => {
    const { id } = useParams();
    const navigate = useNavigate();
    if (!id) navigate("/");

    const { data, isLoading, error } = useQuery({
        queryKey: ["get_related_products", id],
        queryFn: async () => {
            const response = await apiClient.get(`/products/related/${id}`);
            return response.data;
        },
    });

    return { data, isLoading, error };
};

export const useGetProductsByBrand = (
    params: Record<string, unknown> = {},
): QueryType => {
    const { id } = useParams();
    const navigate = useNavigate();
    if (!id) navigate("/");

    const { data, isLoading, error } = useQuery({
        queryKey: ["get_products_by_brand", JSON.stringify({ params, id })],
        queryFn: async () => {
            const response = await apiClient.get(`/products/brand/${id}`, {
                params,
            });
            return response.data;
        },
    });

    return { data, isLoading, error };
};
