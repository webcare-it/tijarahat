import toast from "react-hot-toast";

interface ApiError {
  code?: string;
  message?: string;
  response?: {
    status?: number;

    data?: {
      errors?: string[];
      message?: string;
      not_found_user?: string;
      userType?: string;
    };
  };
  request?: XMLHttpRequest;
}

export const apiErrorHandler = (error: unknown): void => {
  console.error("API ERROR:", error);

  const axiosError = error as ApiError;

  if (axiosError.code === "ERR_NETWORK" || !axiosError.response) {
    toast.error("Server is unavailable. Please try again later.");
    handleServerError(window.location.pathname);
    return;
  }

  if (axiosError.response?.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    toast.error(
      axiosError.response?.data?.message ||
        "Session expired. Please log in again"
    );
    return;
  }

  if (axiosError.response?.data?.not_found_user === "not_found_user") {
    localStorage.removeItem("token");
    return;
  }

  const errorMessages = axiosError.response?.data?.errors || [
    axiosError.response?.data?.message || "An error occurred",
  ];

  errorMessages.forEach((msg: string) => toast.error(msg));
};

export const handleServerError = (currentPath: string) => {
  sessionStorage.setItem("previousPage", currentPath);

  window.location.href = "/500";
};
