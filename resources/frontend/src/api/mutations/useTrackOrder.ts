import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { MutationType } from "../utils/type";

export const useTrackOrderMutation = (): MutationType => {
  const { mutate, isPending } = useMutation({
    mutationKey: ["track_order"],
    mutationFn: async (data: unknown) => {
      const response = await apiClient.get(
        `/track-order/${(data as { id: string | number })?.id}`
      );

      return response.data;
    },
  });

  return { mutate, isPending };
};
