import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SeoWrapper } from "@/components/common/seo-wrapper";
import { AuthDescription } from "./component/description";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { PhoneInput } from "@/components/common/phone-input";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import { Password } from "@/components/common/password";
import {
  useSendOtpMutation,
  useVeryMutation,
  useResetPasswordMutation,
} from "@/api/mutations/useAuth";
import { toast } from "react-hot-toast";
import { apiErrorHandler } from "@/api/utils/error";
import { getCookie, setCookie } from "@/lib/cookie";
import { BaseLayout } from "@/components/layout/base-layout";

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<"phone" | "otp" | "reset">("phone");

  const { mutate: verifyCode, isPending: isVerifying } = useVeryMutation();
  const { mutate: sendOtp, isPending: isSendingOtp } = useSendOtpMutation();
  const { mutate: resetPassword, isPending: isResetting } =
    useResetPasswordMutation();

  const handlePhoneValidated = useCallback((valid: boolean, value: string) => {
    setIsPhoneValid(valid);
    setPhone(value);
  }, []);

  const goToOtp = useCallback(() => {
    if (!isPhoneValid) return;
    const formData = new FormData();
    formData.append("email_or_phone", phone);
    formData.append("send_code_by", "phone");

    sendOtp(formData, {
      onSuccess: (res) => {
        if (res?.result) {
          const otpSent = "OTP sent to";
          const checkPhone = "Please check your phone";

          const toastMsg = `${otpSent}: ${phone}. ${checkPhone}.`;
          toast.success(toastMsg);
          setStep("otp");
        } else {
          toast.error(res?.message || "User is not found!");
        }
      },
      onError: (error) => {
        return apiErrorHandler(error);
      },
    });
  }, [isPhoneValid, phone, sendOtp]);

  const goToReset = useCallback(() => {
    if (otp.trim().length !== 6) return;
    const formData = new FormData();

    setCookie("otp", otp);

    formData.append("verification_code", otp);
    verifyCode(formData, {
      onSuccess: (res) => {
        if (res?.result) {
          toast.success(res?.message || "OTP verified successfully");
          setStep("reset");
        } else {
          toast.error(res?.message || "OTP verification failed");
        }
      },
      onError: (error) => {
        return apiErrorHandler(error);
      },
    });
  }, [otp, verifyCode]);

  const canSubmitReset = password?.length >= 6 && password === confirmPassword;

  const handleReset = useCallback(() => {
    if (!canSubmitReset) return;
    const formData = new FormData();
    const getOtp = getCookie("otp");
    formData.append("password", password);
    formData.append("verification_code", getOtp as string);
    resetPassword(formData, {
      onSuccess: (res) => {
        if (res?.result && res?.access_token) {
          localStorage.removeItem("guest_user_id");
          localStorage.setItem("token", res?.access_token);
          if (res?.user?.id) {
            localStorage.setItem("user_id", res?.user?.id.toString());
          }
          navigate("/");
          toast.success("Password reset successful");
        } else {
          toast.error(res?.message || "Password reset failed");
        }
      },
      onError: (error) => {
        return apiErrorHandler(error);
      },
    });
  }, [canSubmitReset, password, resetPassword, navigate]);

  const handleEnterKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "Enter") return;
      if (step === "phone") {
        goToOtp();
      } else if (step === "otp") {
        goToReset();
      } else if (step === "reset") {
        handleReset();
      }
    },
    [step, goToOtp, goToReset, handleReset]
  );

  const titleText =
    step === "phone"
      ? "Forgot Password?"
      : step === "otp"
      ? "Verify Code"
      : "Reset Password";

  const descriptionText =
    step === "phone"
      ? "Enter your phone number to reset your password"
      : step === "otp"
      ? "Enter the 6-digit code sent to your phone number"
      : "Set a new password for your account";

  return (
    <>
      <SeoWrapper title="Forgot password" />
      <BaseLayout isShowMegaMenu={false}>
        <section className="flex justify-center items-center my-10">
          <div className="flex w-full max-w-lg flex-col gap-6">
            <div className={cn("flex flex-col gap-4 md:gap-6")}>
              <Card className="p-4 mx-4 md:mx-0">
                <CardHeader className="flex gap-2 flex-col items-center justify-center">
                  <div className="text-center mt-4">
                    <CardTitle className="text-xl">{titleText}</CardTitle>
                    <CardDescription className="mt-2 md:mt-3">
                      {descriptionText}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="px-3 md:px-5">
                  <div className="relative overflow-hidden pb-4">
                    <AnimatePresence mode="wait" initial={false}>
                      {step === "phone" && (
                        <motion.div
                          key="step-phone"
                          initial={{ x: 40, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: -40, opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 24,
                          }}
                          className="space-y-4 px-1"
                          tabIndex={0}
                          onKeyDown={handleEnterKey}>
                          <PhoneInput
                            id="phone"
                            name="phone"
                            className="md:h-12"
                            label="Phone"
                            placeholder="01XXXXXXXXX"
                            onValidationChange={handlePhoneValidated}
                          />
                          <Button
                            onClick={goToOtp}
                            disabled={!isPhoneValid || isSendingOtp}
                            className="w-full md:h-12">
                            Continue
                          </Button>
                        </motion.div>
                      )}

                      {step === "otp" && (
                        <motion.div
                          key="step-otp"
                          initial={{ x: 60, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: -60, opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 24,
                          }}
                          className="space-y-4 px-1"
                          tabIndex={0}
                          onKeyDown={handleEnterKey}>
                          <div className="space-y-2 flex flex-col justify-center items-center">
                            <span className="font-semibold text-foreground">
                              {phone}
                            </span>
                            <InputOTP
                              maxLength={6}
                              value={otp}
                              onChange={setOtp}>
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                              </InputOTPGroup>
                              <InputOTPSeparator />
                              <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                              </InputOTPGroup>
                            </InputOTP>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="flex-1 md:h-12"
                              onClick={() => setStep("phone")}>
                              Back
                            </Button>
                            <Button
                              onClick={goToReset}
                              disabled={otp.trim().length !== 6 || isVerifying}
                              className="flex-1 md:h-12">
                              Verify
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {step === "reset" && (
                        <motion.div
                          key="step-reset"
                          initial={{ x: -60, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: 60, opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 24,
                          }}
                          className="space-y-4 px-1"
                          tabIndex={0}
                          onKeyDown={handleEnterKey}>
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <Password
                                id="new-password"
                                name="new-password"
                                label={"New Password"}
                                className="md:h-12"
                                placeholder={"Enter your new password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-1">
                              <Password
                                id="confirm-password"
                                name="confirm-password"
                                label={"Confirm Password"}
                                className="md:h-12"
                                placeholder={"Enter your confirm password"}
                                value={confirmPassword}
                                onChange={(e) =>
                                  setConfirmPassword(e.target.value)
                                }
                                ariaInvalid={
                                  password.length > 0 &&
                                  confirmPassword.length > 0 &&
                                  password !== confirmPassword
                                }
                                required
                              />
                              {password &&
                                confirmPassword &&
                                password !== confirmPassword && (
                                  <div className="text-xs text-destructive">
                                    Passwords do not match
                                  </div>
                                )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="flex-1 md:h-12"
                              onClick={() => setStep("otp")}>
                              Back
                            </Button>
                            <Button
                              className="flex-1 md:h-12"
                              disabled={!canSubmitReset || isResetting}
                              onClick={handleReset}>
                              Reset password
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
              <AuthDescription />
            </div>
          </div>
        </section>
      </BaseLayout>
    </>
  );
};
