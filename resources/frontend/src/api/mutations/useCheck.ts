import { useMutation } from "@tanstack/react-query";
import { apiErrorHandler } from "../utils/error";
import { apiClient } from "@/lib/api-client";
import { toast } from "react-hot-toast";
import type { WithoutDataMutationType } from "../utils/type";
import { useNavigate } from "react-router-dom";

export const useCheckServerMutation = (): WithoutDataMutationType => {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationKey: ["check_server"],
    mutationFn: async () => {
      const [businessSettingsResponse] = await Promise.all([
        apiClient.get("/business-settings"),
      ]);

      if (businessSettingsResponse.data?.success) {
        return {
          success: true,
          message: "Server is available",
          businessSettings: businessSettingsResponse.data,
        };
      } else {
        throw new Error("One or both APIs failed");
      }
    },
    onSuccess: (res) => {
      toast.success(res?.message || "Server is available");
      const previousPage = sessionStorage.getItem("previousPage") || "/";
      sessionStorage.removeItem("previousPage");
      navigate(previousPage);
    },
    onError: (error) => {
      toast.error("Server is not available");
      navigate("/500");
      return apiErrorHandler(error);
    },
  });

  return { mutate, isPending };
};
