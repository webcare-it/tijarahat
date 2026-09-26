import { useQuery } from "@tanstack/react-query";
import type { QueryType } from "../utils/type";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "@/lib/api-client";

export const useGetOrderTrack = (): QueryType => {
  const { id } = useParams();
  const navigate = useNavigate();
  if (!id) navigate("/");

  const { data, isLoading, error } = useQuery({
    queryKey: ["get_order_track", id],
    queryFn: async () => {
      const response = await apiClient.get(`/track-order/${id}`);
      return response.data;
    },
  });

  return { data, isLoading, error };
};
