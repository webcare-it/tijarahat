import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { apiErrorHandler } from "../utils/error";
import type { MutationType } from "../utils/type";
import { toast } from "react-hot-toast";
import { revalidateQueryFn } from "@/lib/query-client";

export const useSubmitReviewMutation = (): MutationType => {
  const { mutate, isPending } = useMutation({
    mutationKey: ["submit_review"],
    mutationFn: async (data: unknown) => {
      const response = await apiClient.post("/reviews/submit", data);
      return response.data;
    },
    onSuccess: (res) => {
      if (res?.result) {
        toast.success(res?.message || "Review submitted successfully");
        revalidateQueryFn("get_reviews");
      } else {
        toast.error(res?.message || "Review submission failed");
      }
    },
    onError: (error) => {
      return apiErrorHandler(error);
    },
  });

  return { mutate, isPending };
};
