import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import type { QueryType } from "../utils/type";
import { getUserId, isAuthenticated } from "@/helper";
import { useNavigate, useParams } from "react-router-dom";
import { apiErrorHandler } from "../utils/error";
import { removeCookie } from "@/lib/cookie";

export const useGetOrdersQuery = (
  filters: Record<string, unknown>
): QueryType => {
  const userId = getUserId();
  const { data, isLoading, error } = useQuery({
    queryKey: ["get_orders", JSON.stringify(filters)],
    queryFn: async () => {
      const response = await apiClient.get(`/purchase-history/${userId}`, {
        params: filters,
      });
      return response.data;
    },
    enabled: !!isAuthenticated(),
  });

  return { data, isLoading, error };
};

export const useGetUserOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) navigate("/orders");

  const { data, isLoading, error } = useQuery({
    queryKey: ["get_user_order_details", id],
    queryFn: async () => {
      const response = await apiClient.get(`/purchase-history-details/${id}`);
      return response.data;
    },
  });

  return { data, isLoading, error };
};

export const useGetOrderSuccessful = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) navigate("/");

  const { data, isLoading, error } = useQuery({
    queryKey: ["get_order_details", id],
    queryFn: async () => {
      const response = await apiClient.get(`/combined-order/${id}`);
      localStorage.setItem(
        "last_order_code",
        response.data?.invoice?.order_code.toString() || ""
      );
      removeCookie("checkout_begin");
      return response.data;
    },
  });

  if (error !== null) {
    apiErrorHandler(error);
    navigate("/");
  }

  return { data, isLoading, error };
};
