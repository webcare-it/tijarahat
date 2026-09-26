import { useMutation } from "@tanstack/react-query";
import { apiErrorHandler } from "../utils/error";
import { apiClient } from "@/lib/api-client";
import { toast } from "react-hot-toast";
import type { MutationType } from "../utils/type";
import { revalidateQueryFn } from "@/lib/query-client";

export const useUpdateProfileMutation = (): MutationType => {
  const { mutate, isPending } = useMutation({
    mutationKey: ["profile_update"],
    mutationFn: async (data: unknown) => {
      const response = await apiClient.post("/profile/update", data);
      return response.data;
    },
    onSuccess: (res) => {
      if (res?.result) {
        toast.success(res?.message || "Profile updated successfully");
        revalidateQueryFn("get_user");
      }
    },
    onError: (error) => {
      return apiErrorHandler(error);
    },
  });

  return { mutate, isPending };
};

export const useUpdateProfileImageMutation = (): MutationType => {
  const { mutate, isPending } = useMutation({
    mutationKey: ["profile_image_update"],
    mutationFn: async (data: unknown) => {
      const response = await apiClient.post("/profile/update-image", data);
      return response.data;
    },
    onSuccess: (res) => {
      if (res?.result) {
        toast.success(res?.message || "Profile updated successfully");
        revalidateQueryFn("get_user");
      }
    },
    onError: (error) => {
      return apiErrorHandler(error);
    },
  });

  return { mutate, isPending };
};
