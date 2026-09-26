import { useEffect, useState, useMemo } from "react";
import { CreditCard } from "lucide-react";
import { usePaymentMethods } from "@/api/queries/usePayment";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/common/skeleton";
import { OptimizedImage } from "@/components/common/optimized-image";

interface PaymentMethodType {
  payment_type: string;
  payment_type_key: string;
  image: string;
  name: string;
  title: string;
  offline_payment_id: number;
  details: string;
}

export const PaymentMethods = () => {
  const { data, isLoading } = usePaymentMethods();
  const [selectedPayment, setSelectedPayment] = useState<string>("");

  const paymentMethods = useMemo(
    () => (data as PaymentMethodType[]) || [],
    [data]
  );

  const handlePaymentSelect = (paymentKey: string) => {
    setSelectedPayment(paymentKey);
    localStorage.setItem("selected_payment_method", paymentKey);
  };

  useEffect(() => {
    if (paymentMethods?.length > 0) {
      setSelectedPayment("cash_on_delivery");
      localStorage.setItem("selected_payment_method", "cash_on_delivery");
    }
  }, [paymentMethods]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4 mt-4 md:mt-6">
        <CreditCard className="md:size-6 size-5 text-primary" />
        <h3 className="text-lg font-semibold">Select Payment Method</h3>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-4 flex-wrap">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg " />
          ))}
        </div>
      ) : (
        <RadioGroup
          value={selectedPayment}
          onValueChange={handlePaymentSelect}
          className="flex items-center gap-4 flex-wrap"
          disabled={isLoading}>
          {paymentMethods?.length > 0 ? (
            paymentMethods?.map((payment: PaymentMethodType) => (
              <Card
                key={payment?.payment_type_key}
                className={cn(
                  "cursor-pointer py-2 md:py-3 transition-all duration-200 hover:shadow-md flex-1",
                  selectedPayment === payment?.payment_type_key
                    ? "ring-2 ring-primary bg-primary/5"
                    : "hover:bg-accent",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => handlePaymentSelect(payment?.payment_type_key)}>
                <CardContent className="px-3 md:px-4">
                  <div className="flex items-center gap-4">
                    <RadioGroupItem
                      value={payment?.payment_type_key}
                      className="flex-shrink-0 md:size-6 size-5"
                    />

                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center gap-2 md:gap-3">
                        <OptimizedImage
                          src={payment?.image || ""}
                          alt={payment.name}
                          className="w-8 h-8 object-contain"
                        />

                        <h4 className="text-sm md:text-base font-medium text-foreground">
                          {payment?.title || payment?.name}
                        </h4>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center text-muted-foreground">
              No payment methods found
            </div>
          )}
        </RadioGroup>
      )}
    </div>
  );
};
