import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export const useGetPolicy = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["get_policy"],
    queryFn: async () => {
      const response = await apiClient.get("/policies/return");
      return response.data;
    },
  });

  return { data, isLoading, error };
};

export const useGetCustomPage = () => {
  const navigate = useNavigate();
  const { key } = useParams();

  if (!key) navigate("/");

  const { data, isLoading, error } = useQuery({
    queryKey: ["get_custom_page", key],
    queryFn: async () => {
      const response = await apiClient.get(`/pages/${key}`);
      return response.data;
    },
  });

  return { data, isLoading, error, key };
};
