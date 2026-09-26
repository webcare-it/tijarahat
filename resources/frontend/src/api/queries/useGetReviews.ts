import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import type { QueryType } from "../utils/type";
import { useNavigate, useParams } from "react-router-dom";

export const useGetReviews = (): QueryType => {
  const { id } = useParams();
  const navigate = useNavigate();
  if (!id) navigate("/");

  const { data, isLoading, error } = useQuery({
    queryKey: ["get_reviews", id],
    queryFn: async () => {
      const response = await apiClient.get(`/reviews/product/${id}`);
      return response.data;
    },
  });

  return { data, isLoading, error };
};
