import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { MutationType } from "../utils/type";

export const useAddToWishlistMutation = (): MutationType => {
  const { mutate, isPending } = useMutation({
    mutationKey: ["add_to_wishlist"],
    mutationFn: async (data: unknown) => {
      const response = await apiClient.post("/wishlists", data);
      return response.data;
    },
  });

  return { mutate, isPending };
};

export const useRemoveWishlistMutation = (): MutationType => {
  const { mutate, isPending } = useMutation({
    mutationKey: ["remove_wishlist"],
    mutationFn: async (data: unknown) => {
      const response = await apiClient.delete(
        `/wishlists/${(data as { id: number | string })?.id}`
      );
      return response.data;
    },
  });

  return { mutate, isPending };
};
