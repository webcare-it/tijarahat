import { SeoWrapper } from "@/components/common/seo-wrapper";
import { BaseLayout } from "@/components/layout/base-layout";
import { Skeleton } from "@/components/common/skeleton";
import { CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useGetOrderSuccessful } from "@/api/queries/userOrders";
import type { InvoiceType } from "@/type";
import {
  OrderDetailsCard,
  OrderDetailsSkeleton,
} from "@/components/card/order-details";
import {
  useGtmTracker,
  type PurchaseTrackerType,
  type PersonalDataType,
} from "@/hooks/useGtmTracker";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getLocalStorage,
  removeCurrencySymbol,
  removeLocalStorage,
  setLocalStorage,
} from "@/helper";
import confetti from "canvas-confetti";

export const OrderCompletePage = () => {
  const hasTracked = useRef(false);
  const [ip, setIp] = useState("");
  const { purchaseTracker } = useGtmTracker();
  const { data, isLoading } = useGetOrderSuccessful();
  const order = useMemo(() => (data?.invoice as InvoiceType) || {}, [data]);

  useEffect(() => {
    removeLocalStorage("selected_shipping_method");
    if (!ip) {
      fetch("https://api.ipify.org?format=json")
        .then((res) => res?.json())
        .then((data) => setIp(data?.ip));
    }
  }, [ip]);

  useEffect(() => {
    if (order) {
      const productInfo: PurchaseTrackerType = {
        transaction_id: order?.order_code || "",
        coupon: order?.coupon || "",
        tax: removeCurrencySymbol(order?.tax?.toString() || "0"),
        shipping: removeCurrencySymbol(order?.shipping_cost?.toString() || "0"),
        value: removeCurrencySymbol(order?.subtotal?.toString() || "0") || 0,
        customer_type:
          (order?.customer_type?.toLowerCase() as "new" | "returning") || "new",
        items: order?.order_items?.map((item) => ({
          item_id: item?.product_id?.toString() || "",
          item_name: item?.product_name || "",
          item_price: removeCurrencySymbol(item?.price?.toString() || "0") || 0,
          item_category: item?.category_name || "",
          item_quantity: item?.quantity || 1,
        })),
      };

      const personalInfo: PersonalDataType = {
        ip_address: ip || navigator.userAgent,
        email: order?.shipping_address?.email || order?.user?.email || "",
        phone: order?.shipping_address?.phone || order?.user?.phone || "",
        name: order?.shipping_address?.name || order?.user?.name || "",
        address: order?.shipping_address?.address || "",
      };
      if (
        order &&
        order?.order_code &&
        order?.order_items?.length > 0 &&
        ip &&
        !hasTracked.current &&
        !getLocalStorage("order_completed")
      ) {
        purchaseTracker(productInfo, personalInfo);
        hasTracked.current = true;
        setLocalStorage("order_completed", "true");
      }
    }
  }, [order, purchaseTracker, ip]);

  useEffect(() => {
    if (getLocalStorage("order_completed")) return;

    const shoot = (options = {}) => {
        confetti({
            particleCount: 400,
            spread: 90,
            startVelocity: 40,
            ticks: 300,
            gravity: 0.7,
            decay: 0.94,
            shapes: ["square", "circle", "star"],
            colors: [
                "#22c55e",
                "#06b6d4",
                "#facc15",
                "#ef4444",
                "#8b5cf6",
                "#ec4899",
            ],
            scalar: 1.2,
            zIndex: 1000,
            ...options,
        });
    };
    shoot({ particleCount: 600, origin: { x: 0.5, y: 0.6 } });

    setTimeout(() => {
        shoot({
            particleCount: 500,
            angle: 60,
            origin: { x: 0, y: 0.5 },
            spread: 120,
        });
    }, 300);

    setTimeout(() => {
        shoot({
            particleCount: 500,
            angle: 120,
            origin: { x: 1, y: 0.5 },
            spread: 120,
        });
    }, 500);

    setTimeout(() => {
        shoot({
            particleCount: 400,
            origin: { x: 0.3, y: 0 },
            angle: 45,
            spread: 100,
        });
        shoot({
            particleCount: 400,
            origin: { x: 0.7, y: 0 },
            angle: 135,
            spread: 100,
        });
    }, 800);

    setTimeout(() => {
        shoot({
            particleCount: 600,
            origin: { x: 0.5, y: 0.2 },
            spread: 180,
            startVelocity: 25,
            ticks: 400,
        });
    }, 1400);
}, []);

  if (isLoading) {
    return (
      <>
        <SeoWrapper title={"Order Successful!"} />
        <BaseLayout isShowMegaMenu={false} isContainer={false}>
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 relative">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center py-12">
                <Skeleton className="h-20 w-20 mx-auto rounded-full mb-6" />
                <Skeleton className="h-8 w-64 mx-auto mb-4" />
                <Skeleton className="h-4 w-48 mx-auto" />
              </div>
              <OrderDetailsSkeleton />
            </div>
          </div>
        </BaseLayout>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <SeoWrapper title={"Order Successful!"} />
        <BaseLayout isShowMegaMenu={false} isContainer={false}>
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center py-12">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">
                  {"Order not found"}
                </h3>
              </div>
            </div>
          </div>
        </BaseLayout>
      </>
    );
  }

  return (
    <>
      <SeoWrapper title={"Order Successful!"} />
      <BaseLayout isShowMegaMenu={false} isContainer={false}>
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 relative">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2,
                }}
                className="inline-block mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
              </motion.div>

              <h1 className="text-4xl font-bold text-green-600 mb-2">
                {"Order Successful!"}
              </h1>
              <p className="text-lg text-muted-foreground dark:text-gray-300">
                {"Thank you for your purchase."}
              </p>
            </motion.div>

            <OrderDetailsCard order={order} path="/track-order" />
          </div>
        </div>
      </BaseLayout>
    </>
  );
};
