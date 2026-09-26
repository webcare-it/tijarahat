import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NoDataFound } from "@/components/common/no-data-found";
import { useTrackOrderMutation } from "@/api/mutations/useTrackOrder";
import { apiErrorHandler } from "@/api/utils/error";
import { OrderTrackStep } from "./step";
import { Spinner } from "@/components/ui/spinner";
import { OrderTrackDetails } from "./details";
import {
  transformApiResponseToOrderData,
  type OrderDataType,
  type ApiOrderResponseType,
} from "./utils";
import { OrderTrackSkeleton } from "./skeleton";

export const OrderTrack = ({ path }: { path: string }) => {
  const [error, setError] = useState("");

  const [orderCode, setOrderCode] = useState("");
  const { mutate, isPending } = useTrackOrderMutation();
  const [orderData, setOrderData] = useState<OrderDataType | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderCode.trim()) {
      setError("Please enter an order code");
      return;
    }

    setError("");

    mutate(
      { id: orderCode },
      {
        onSuccess: (res) => {
          if (res?.result) {
            const transformedData = transformApiResponseToOrderData(
              res?.data as unknown as ApiOrderResponseType
            );
            setOrderData(transformedData);
          } else {
            setError(
              res?.message || "Order not found. Please check your order code."
            );
            setOrderData(null);
          }
        },
        onError: (error) => {
          setError("Order not found. Please check your order code.");
          setOrderData(null);
          return apiErrorHandler(error);
        },
      }
    );
  };

  const handleReset = () => {
    setOrderCode("");
    setOrderData(null);
    setError("");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto mb-8">
        <Card className="shadow-lg">
          <CardContent className="p-4 md:px-6">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    type="text"
                    name="order_code"
                    placeholder="Enter order code (e.g., ORD-2024-001234 or 'demo')"
                    value={orderCode}
                    onChange={(e) => setOrderCode(e.target.value)}
                    className="w-full md:h-12"
                    disabled={isPending}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 sm:flex-none  md:h-12">
                    {isPending ? (
                      <>
                        <Spinner />
                        {"Processing..."}
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        {"Search"}
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    disabled={isPending}
                    className="md:h-12">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-destructive">
                  {error}
                </motion.p>
              )}
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <OrderTrackCard orderData={orderData} isPending={isPending} path={path} />
    </>
  );
};

interface Props {
  orderData: OrderDataType | null;
  isPending: boolean;
  path: string;
}
export const OrderTrackCard = ({ orderData, isPending, path }: Props) => {
  return (
    <AnimatePresence mode="wait">
      {orderData ? (
        <motion.div
          key="order-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}>
          <OrderTrackStep orderData={orderData} />
          <OrderTrackDetails orderData={orderData} path={path} />
        </motion.div>
      ) : isPending ? (
        <OrderTrackSkeleton />
      ) : !orderData ? (
        <motion.div
          key="empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          <NoDataFound
            title={"Enter Order Code to Track"}
            description={
              "Please enter your order code above to track your order status."
            }
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
