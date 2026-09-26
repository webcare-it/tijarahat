import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { MutationType } from "../utils/type";

export const useAddToCartMutation = (): MutationType => {
  const { mutate, isPending } = useMutation({
    mutationKey: ["add_to_cart"],
    mutationFn: async (data: unknown) => {
      const response = await apiClient.post("/carts/add", data);
      return response.data;
    },
  });

  return { mutate, isPending };
};

export const useRemoveCartMutation = (): MutationType => {
  const { mutate, isPending } = useMutation({
    mutationKey: ["remove_cart"],
    mutationFn: async (data: unknown) => {
      const response = await apiClient.delete(
        `/carts/${(data as { id: number | string })?.id}`
      );
      return response.data;
    },
  });

  return { mutate, isPending };
};

export const useUpdateCartMutation = (): MutationType => {
  const { mutate, isPending } = useMutation({
    mutationKey: ["update_cart"],
    mutationFn: async (data: unknown) => {
      const response = await apiClient.post("/carts/change-quantity", data);
      return response.data;
    },
  });

  return { mutate, isPending };
};
