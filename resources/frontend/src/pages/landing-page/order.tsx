import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckoutForm } from "../checkout/form";
import { Spinner } from "@/components/ui/spinner";
import { CreditCard } from "lucide-react";
import { useCheckoutController } from "@/controllers/checkoutController";
import { Card } from "@/components/ui/card";
import { ShippingCost } from "../checkout/shipping";
import { PaymentMethods } from "../checkout/payment";
import { cn } from "@/lib/utils";
import { OrderConfirmOtp } from "@/components/common/checkout-otp";
import { CampaignCartSummary } from "./summary";

export const OrdersSection = () => {
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

    return (
        <>
            <div className="grid md:grid-cols-2 gap-6 mt-4">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <Card
                        className={cn("p-2 md:p-6 md:sticky md:top-28 bg-card")}
                    >
                        <h3 className="text-2xl font-bold text-foreground">
                            Shipping Information
                        </h3>
                        <CheckoutForm info={info} setInfo={setInfo} />
                        <ShippingCost
                            selectedShipping={selectedShipping}
                            setSelectedShipping={setSelectedShipping}
                        />
                        <PaymentMethods />
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <CampaignCartSummary
                        setSelectedShipping={setSelectedShipping}
                    >
                        <Button
                            className="w-full"
                            size="lg"
                            type="button"
                            disabled={isPending || otpLoading}
                            onClick={handlePlaceOrder}
                        >
                            {isPending ? (
                                <>
                                    <Spinner />
                                    <span>{"Processing..."}</span>
                                </>
                            ) : (
                                <>
                                    <CreditCard className="h-5 w-5 mr-2" />
                                    <span>{"Place Order"}</span>
                                </>
                            )}
                        </Button>
                    </CampaignCartSummary>
                </motion.div>
            </div>
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
