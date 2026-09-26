import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { getGuestUserId, getUserId, setLocalStorage } from "@/helper";
import { useEffect } from "react";

type QueryType = {
  data: {
    name: string;
    owner_id: number;
    cart_items: {
      id: number;
      owner_id: number;
      user_id: number;
      product_id: number;
      category_name: string;
      product_name: string;
      product_thumbnail_image: string;
      variation: string;
      price: number;
      currency_symbol: string;
      tax: number;
      shipping_cost: number;
      quantity: number;
    }[];
  }[];
  error: unknown;
  isLoading: boolean;
  refetch: () => void;
};

export const useGetCartQuery = (): QueryType => {
  const userId = getUserId() || getGuestUserId();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["get_cart", userId],
    queryFn: async () => {
      const response = await apiClient.post(`/carts/${userId}`);
      return response.data;
    },
    staleTime: 0,
    gcTime: 0,
    enabled: !!userId,
  });

  return { data, isLoading, error, refetch };
};

export const useGetCampaignCartQuery = (): QueryType => {
  const id = getGuestUserId();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["get_cart_campaign", id],
    queryFn: async () => {
      const response = await apiClient.post(`/carts/${id}`);
      return response.data;
    },
    staleTime: 0,
    gcTime: 0,
    enabled: !!id,
  });

  return { data, isLoading, error, refetch };
};

export const useGetCartSummaryQuery = (): QueryType => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["get_cart_summary"],
    queryFn: async () => {
      const response = await apiClient.get(`/cart-summary/${getUserId() || getGuestUserId()}`);
      return response.data;
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (data?.coupon_code !== undefined) {
      setLocalStorage("coupon_code", data.coupon_code || "");
    }
  }, [data?.coupon_code]);

  return { data, isLoading, error, refetch };
};

export const useGetCampaignSummaryQuery = (): QueryType => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["get_campaign_summary"],
    queryFn: async () => {
      const response = await apiClient.get(`/cart-summary/${getGuestUserId()}`);
      setLocalStorage("coupon_code", response.data?.coupon_code || "");
      return response.data;
    },
    staleTime: 0,
    gcTime: 0,
    enabled: !!getGuestUserId(),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });

  return { data, isLoading, error, refetch };
};
