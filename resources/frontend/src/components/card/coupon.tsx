import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Input } from "../ui/input";
import {
  useCouponApplyMutation,
  useCouponRemoveMutation,
} from "@/api/mutations/useCoupon";
import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { getUserId, isAuthenticated } from "@/helper";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { RootStateType } from "@/redux/store";
import { useSelector } from "react-redux";

export const Coupon = ({ couponCode }: { couponCode?: string }) => {
  const navigate = useNavigate();
  const cart = useSelector((state: RootStateType) => state.cart?.items?.length);
  const [coupon, setCoupon] = useState(couponCode || "");
  const { mutate, isPending } = useCouponApplyMutation();
  const { mutate: mutateRemove, isPending: isPendingRemove } =
    useCouponRemoveMutation();

  const handleApplyCoupon = () => {
    if (!isAuthenticated()) {
      toast.error("Please login to apply coupon");
      navigate("/signin");
      return;
    }
    const formData = new FormData();
    formData.append("coupon_code", coupon);
    formData.append("user_id", getUserId() as string);
    mutate(formData);
  };

  const handleRemoveCoupon = () => {
    const formData = new FormData();
    formData.append("user_id", getUserId() as string);
    mutateRemove(formData);
  };

  useEffect(() => {
    setCoupon(couponCode || "");
  }, [couponCode]);

  const loading = isPending || isPendingRemove;

  return (
    <div>
      <ButtonGroup className="w-full h-10">
        <Input
          placeholder={"Enter Coupon code"}
          className={cn(
            "h-9 md:h-10",
            couponCode && "cursor-not-allowed bg-accent"
          )}
          type="text"
          readOnly={!!couponCode}
          disabled={cart === 0 || loading}
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
        />
        <Button
          disabled={cart === 0 || loading || coupon === ""}
          aria-label="Search"
          className="h-9 md:h-10 text-white"
          onClick={couponCode ? handleRemoveCoupon : handleApplyCoupon}>
          {loading ? (
            <>
              <Spinner />
              {"Processing..."}
            </>
          ) : couponCode ? (
            "Remove"
          ) : (
            "Apply"
          )}
        </Button>
      </ButtonGroup>
      {couponCode && (
        <div className="text-sm text-green-600 font-medium flex items-center gap-1">
          {"Coupon code applied"}:{" "}
          <span className="font-bold">[{couponCode}]</span>
        </div>
      )}
    </div>
  );
};
