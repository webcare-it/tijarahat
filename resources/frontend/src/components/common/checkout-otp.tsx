import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "react-hot-toast";
import { Spinner } from "../ui/spinner";
import { useState, useEffect } from "react";
import { useResendOtp } from "@/controllers/checkoutController";

interface Props {
  otp: string;
  isPending: boolean;
  setOtp: (otp: string) => void;
  onOtpSuccess: () => void;
}

export const OrderConfirmOtp = ({
  otp,
  setOtp,
  isPending,
  onOtpSuccess,
}: Props) => {
  const [timer, setTimer] = useState(60 * 10);
  const [resendTimer, setResendTimer] = useState(60 * 2);
  const { isLoading, resendOtpFn } = useResendOtp();

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  useEffect(() => {
    if (resendTimer > 0) {
      const countdown = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(countdown);
    }
  }, [resendTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (otp?.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    onOtpSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl relative">
        <h1 className="text-3xl font-bold text-center text-foreground mb-2">
          {"Order Confirmation OTP"}
        </h1>
        <p className="text-center text-muted-foreground mb-6">
          {"Please enter the 6-digit code sent to your phone"}
        </p>

        <div className="text-center mb-4">
          <div className="text-lg font-mono text-primary mb-2">
            {"OTP valid for"}:{formatTime(timer)}
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
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

          {resendTimer > 0 ? (
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              {"Resend available in"} : {formatTime(resendTimer)}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                {"Did not receive OTP?"}
              </p>
              <Button
                disabled={isLoading}
                variant="link"
                type="button"
                size="sm"
                onClick={() => {
                  resendOtpFn();
                  setTimer(60 * 10);
                  setResendTimer(60 * 3);
                }}>
                {"Resend OTP"}
              </Button>
            </div>
          )}
          <Button
            className="w-full"
            size="lg"
            type="submit"
            disabled={isPending || isLoading || otp?.length !== 6}>
            {isPending ? (
              <>
                <Spinner />
                <span>{"Processing..."}</span>
              </>
            ) : (
              <span>{"Submit"}</span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
