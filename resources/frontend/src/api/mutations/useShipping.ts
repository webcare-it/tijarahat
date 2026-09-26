import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { MutationType } from "../utils/type";

export const useShippingCostMutation = (): MutationType => {
  const { mutate, isPending } = useMutation({
    mutationKey: ["update_shipping_cost_in_cart"],
    mutationFn: async (data: unknown) => {
      const response = await apiClient.post(
        "/update-shipping-cost-in-cart",
        data
      );
      return response.data;
    },
  });

  return { mutate, isPending };
};
