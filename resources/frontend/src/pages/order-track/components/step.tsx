import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingCart,
  Package,
  Truck,
  MapPin,
  X,
  Navigation2,
} from "lucide-react";
import type { OrderDataType, OrderStatusType, OrderStepType } from "./utils";

export const OrderTrackStep = ({ orderData }: { orderData: OrderDataType }) => {
  const orderSteps: OrderStepType[] = [
    {
      id: "place_order",
      label: "Place Order",
      icon: ShoppingCart,
    },
    {
      id: "processing",
      label: "Processing",
      icon: Package,
    },
    {
      id: "quality_check",
      label: "Picked Up",
      icon: Truck,
    },
    {
      id: "on_the_way",
      label: "On the Way",
      icon: Navigation2,
    },
    {
      id: "delivered",
      label: "Delivered",
      icon: MapPin,
    },
  ];

  const getStatusIndex = (status: OrderStatusType): number => {
    return orderSteps?.findIndex((step) => step?.id === status);
  };

  const currentStatusIndex = orderData
    ? getStatusIndex(orderData?.order_status)
    : -1;

  return (
    <Card className="shadow-lg mb-8">
      <CardContent className="p-4">
        <h2 className="text-xl font-bold mb-6 ml-4">{"Order Status"}</h2>

        {orderData?.order_status === "cancelled" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.3,
                }}
                className="relative">
                <motion.div
                  className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-destructive text-white flex items-center justify-center shadow-lg"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(239, 68, 68, 0.7)",
                      "0 0 0 10px rgba(239, 68, 68, 0)",
                      "0 0 0 0 rgba(239, 68, 68, 0)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}>
                  <motion.div
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.4,
                      type: "spring",
                      stiffness: 200,
                    }}>
                    <X className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white" />
                  </motion.div>
                </motion.div>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-base md:text-lg lg:text-xl font-semibold text-center text-destructive">
                {"Order cancelled"}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-xs md:text-sm text-center text-muted-foreground max-w-sm px-2">
                {"This order has been cancelled and cannot be processed."}
              </motion.p>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="hidden md:block relative">
              <div className="absolute top-12 left-[10%] right-[10%] h-0.5 bg-muted z-0" />

              <motion.div
                className="absolute top-12 left-[10%] h-0.5 bg-primary z-10"
                initial={{ width: 0 }}
                animate={{
                  width:
                    currentStatusIndex >= 0
                      ? `${
                          (currentStatusIndex / (orderSteps.length - 1)) * 80
                        }%`
                      : "0%",
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />

              <div className="relative z-20 grid grid-cols-5 gap-0">
                {orderSteps?.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;

                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                      }}
                      className="flex flex-col items-center">
                      <div
                        className={`relative w-20 h-20 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-lg scale-105"
                            : "bg-muted text-muted-foreground"
                        }`}>
                        <Icon
                          className={`w-8 h-8 ${isActive ? "text-white" : ""}`}
                        />
                        {isCurrent && (
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-primary"
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [1, 0.5, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        )}
                      </div>

                      <p
                        className={`text-sm font-medium text-center ${
                          isActive ? "text-foreground" : "text-muted-foreground"
                        }`}>
                        {step.label}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
            <div className="md:hidden relative pl-10">
              <div className="absolute left-10 top-8 bottom-8 w-0.5 bg-muted z-0" />
              <motion.div
                className="absolute left-10 top-8 w-0.5 bg-primary z-10"
                initial={{ height: 0 }}
                animate={{
                  height:
                    currentStatusIndex >= 0
                      ? `calc(${
                          (currentStatusIndex / (orderSteps.length - 1)) * 100
                        }% - 2rem)`
                      : "0%",
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />

              <div className="relative z-20 space-y-6">
                {orderSteps?.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;

                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                      }}
                      className="relative flex items-center gap-4 -ml-8">
                      <div
                        className={`relative z-20 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "bg-muted text-muted-foreground"
                        }`}>
                        <Icon
                          className={`w-6 h-6 ${isActive ? "text-white" : ""}`}
                        />
                        {isCurrent && (
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-primary"
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [1, 0.5, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        )}
                      </div>

                      <div className="flex-1 pt-2">
                        <p
                          className={`text-sm font-semibold ${
                            isActive
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}>
                          {step.label}
                        </p>
                        {isCurrent && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-muted-foreground">
                            {"Current status"}
                          </motion.p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
