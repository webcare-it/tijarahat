import { useMutation } from "@tanstack/react-query";
import { apiErrorHandler } from "../utils/error";
import { apiClient } from "@/lib/api-client";
import type { MutationType } from "../utils/type";
import { toast } from "react-hot-toast";

export const useNewsletterSubscribeMutation = (): MutationType => {
  const { mutate, isPending } = useMutation({
    mutationKey: ["newsletter_subscribe"],
    mutationFn: async (data: unknown) => {
      const response = await apiClient.post("/subscribers/store", data);
      return response.data;
    },
    onSuccess: (res) => {
      if (res?.result) {
        toast.success(res?.message || "Newsletter subscribed successfully");
      } else {
        const mgs = res?.errors?.email?.[0] || "Failed to subscribe newsletter";
        toast.error(mgs);
      }
    },
    onError: (error) => {
      return apiErrorHandler(error);
    },
  });

  return { mutate, isPending };
};
