import { BaseLayout } from "@/components/layout/base-layout";
import { useSelector } from "react-redux";
import type { RootStateType } from "@/redux/store";
import { CartSummary } from "@/components/card/summary";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/common/section-title";
import { SeoWrapper } from "@/components/common/seo-wrapper";
import { ShippingCost } from "./shipping";
import { PaymentMethods } from "./payment";
import { CheckoutForm } from "./form";
import { Spinner } from "@/components/ui/spinner";
import { cartTotalItems, cartTotalPrice } from "@/helper";
import { useEffect } from "react";
import { EmptyCart } from "@/components/common/empty-cart";
import { useGtmTracker, type PurchaseTrackerType } from "@/hooks/useGtmTracker";
import { getCookie, setCookie } from "@/lib/cookie";
import { useCheckoutController } from "@/controllers/checkoutController";
import { OrderConfirmOtp } from "@/components/common/checkout-otp";

export const CheckoutPage = () => {
  const { startCheckoutTracker } = useGtmTracker();
  const cart = useSelector((state: RootStateType) => state.cart?.items);
  const {
    otp,
    info,
    setOtp,
    setInfo,
    isPending,
    otpLoading,
    isActiveOtp,
    showOtpModal,
    selectedShipping,
    handlePlaceOrder,
    handleOtpSuccess,
    setSelectedShipping,
  } = useCheckoutController();

  useEffect(() => {
    if (cart?.length > 0 && !getCookie("checkout_begin")) {
      setCookie("checkout_begin", "checkout_begin");

      const trackerData: PurchaseTrackerType = {
        transaction_id: Math.random().toString(36).substring(2, 15),
        value: cartTotalPrice(cart || []) || 0,
        customer_type: "new",
        items: cartTotalItems(cart || []) || [],
      };
      startCheckoutTracker(trackerData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <SeoWrapper title="Your Checkout" />
      <BaseLayout>
        <section className="mb-10 md:mb-20 mt-10">
          <SectionTitle title="Checkout" />
          {cart?.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 mx-4 md:mx-0 lg:grid-cols-3 gap-4 lg:gap-8">
              <div className="lg:col-span-2">
                <div className="p-3 md:p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold mb-6">
                    Checkout Information
                  </h3>
                  <CheckoutForm info={info} setInfo={setInfo} />
                  <ShippingCost
                    selectedShipping={selectedShipping}
                    setSelectedShipping={setSelectedShipping}
                  />
                  <PaymentMethods />
                </div>
              </div>

              <div className="lg:col-span-1">
                <CartSummary isShowCartItems={true}>
                  <Button
                    className="w-full"
                    size="lg"
                    type="button"
                    disabled={!!otp || isPending || otpLoading}
                    onClick={handlePlaceOrder}>
                    {isPending || otpLoading ? (
                      <>
                        <Spinner />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        <span>Place Order</span>
                      </>
                    )}
                  </Button>
                </CartSummary>
              </div>
            </div>
          )}
        </section>
      </BaseLayout>
      {isActiveOtp && showOtpModal && (
        <OrderConfirmOtp
          otp={otp}
          setOtp={setOtp}
          isPending={isPending}
          onOtpSuccess={handleOtpSuccess}
        />
      )}
    </>
  );
};
