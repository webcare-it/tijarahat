import {
  useCheckoutMutation,
  useSendOrderOtpMutation,
} from "@/api/mutations/useCheckout";
import {
  getGuestUserId,
  getSelectedPaymentMethod,
  getUserId,
  getConfig,
  removeLocalStorage,
  setLocalStorage,
  getLocalStorage,
} from "@/helper";
import { usePhoneValidation } from "@/hooks/usePhoneValidation";
import type { InfoType } from "@/pages/checkout/form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useConfig } from "@/hooks/useConfig";
import { apiErrorHandler } from "@/api/utils/error";
import { revalidateQueryFn } from "@/lib/query-client";
import { clearCartFn } from "@/redux/slice/cartSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const _init = {
  name: "",
  phone: "",
  address: "",
  notes: "",
};

export const useCheckoutController = () => {
  const config = useConfig();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState<string>("");
  const [info, setInfo] = useState<InfoType>(_init);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<string>("");
  const isActiveOtp = getConfig(config, "otp_for_order")?.value === "1";
  const [orderFormData, setOrderFormData] = useState<FormData | null>(null);

  const { validateBangladeshiPhone } = usePhoneValidation();
  const { mutate: otpHook, isPending } = useSendOrderOtpMutation();
  const { mutate, isPending: checkoutLoading } = useCheckoutMutation();

  const clearFun = () => {
    setSelectedShipping("");
    revalidateQueryFn("get_cart");
    removeLocalStorage("order_completed");
    revalidateQueryFn("get_cart_summary");
    dispatch(clearCartFn());
    removeLocalStorage("last_order_code");
    removeLocalStorage("selected_payment_method");
  };

  const handlePlaceOrder = () => {
    const formData = new FormData();
    const paymentType = getSelectedPaymentMethod();
    if (paymentType === "") {
      toast.error("Please select a payment method");
      return;
    }
    formData.append("payment_type", paymentType);

    if (selectedShipping === "") {
      toast.error("Please select a shipping method");
      return;
    }
    if (!info.name || info.name === "") {
      toast.error("Name is required");
      return;
    }
    if (!info.phone || info.phone === "") {
      toast.error("Phone is required");
      return;
    }
    const phoneValidation = validateBangladeshiPhone(info.phone);
    if (!phoneValidation.isValid) {
      toast.error(phoneValidation.error || "Invalid phone number");
      return;
    }
    if (!info.address || info.address === "") {
      toast.error("Address is required");
      return;
    }
    formData.append("name", info.name);
    formData.append("phone", info.phone);
    formData.append("address", info.address);
    formData.append("notes", info.notes);
    const userId = getUserId() || getGuestUserId();
    formData.append("user_id", userId as string);

    const formOtpData = new FormData();
    formOtpData.append("phone", info.phone);
    setLocalStorage("phone_for_otp", info.phone);

    if (isActiveOtp) {
      otpHook(formOtpData, {
        onSuccess: (res) => {
          if (res?.result) {
            toast.success(res?.message || "OTP sent successfully");
            setOrderFormData(formData);
            setShowOtpModal(true);
          } else {
            toast.error(res?.message || "Failed to send OTP");
          }
        },
        onError: (error) => {
          return apiErrorHandler(error);
        },
      });
    } else {
      mutate(formData, {
        onSuccess: (res) => {
          if (res?.result) {
            toast.success(res?.message || "Order placed successfully");
            clearFun();
            removeLocalStorage("phone_for_otp");
            if (res?.combined_order_id) {
              navigate(`/orders/details/${res?.combined_order_id}`);
            }
          } else {
            toast.error(res?.message || "Failed to place order");
          }
        },
        onError: (error) => {
          return apiErrorHandler(error);
        },
      });
    }
  };

  const handleOtpSuccess = () => {
    if (orderFormData) {
      const formData = orderFormData;
      formData.append("otp_code", otp);
      mutate(formData, {
        onSuccess: (res) => {
          if (res?.result) {
            toast.success(res?.message || "Order placed successfully");
            clearFun();
            setOtp("");
            setInfo(_init);
            setOrderFormData(null);
            removeLocalStorage("phone_for_otp");
            if (res?.combined_order_id) {
              navigate(`/orders/details/${res?.combined_order_id}`);
            }
          } else {
            toast.error(res?.message || "Failed to place order");
          }
        },
        onError: (error) => {
          return apiErrorHandler(error);
        },
      });
    }
  };

  return {
    otp,
    setOtp,
    info,
    setInfo,
    isPending: checkoutLoading,
    otpLoading: isPending,
    isActiveOtp,
    showOtpModal,
    selectedShipping,
    setSelectedShipping,
    setShowOtpModal,
    handlePlaceOrder,
    handleOtpSuccess,
  };
};

export const useResendOtp = () => {
  const { mutate, isPending } = useSendOrderOtpMutation();

  const resendOtpFn = () => {
    const formData = new FormData();
    formData.append("phone", getLocalStorage("phone_for_otp"));

    mutate(formData, {
      onSuccess: (res) => {
        if (res?.result) {
          toast.success(res?.message || "OTP resend successfully");
        } else {
          toast.error(res?.message || "Failed to resend OTP");
        }
      },
      onError: (error) => {
        return apiErrorHandler(error);
      },
    });
  };

  return { resendOtpFn, isLoading: isPending };
};
