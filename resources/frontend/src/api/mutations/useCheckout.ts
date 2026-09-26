import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { MutationType } from "../utils/type";

export const useCheckoutMutation = (): MutationType => {
  const { mutate, isPending } = useMutation({
    mutationKey: ["order_store"],
    mutationFn: async (data: unknown) => {
      const response = await apiClient.post("/order/store", data);
      return response.data;
    },
  });

  return { mutate, isPending };
};

export const useSendOrderOtpMutation = (): MutationType => {
  const { mutate, isPending } = useMutation({
    mutationKey: ["order_confirm_otp"],
    mutationFn: async (data: unknown) => {
      const response = await apiClient.post("/order/send-otp", data);
      return response.data;
    },
  });

  return { mutate, isPending };
};
