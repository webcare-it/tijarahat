import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Coupon } from "./coupon";
import { useGetCartSummaryQuery } from "@/api/queries/useGetCart";
import { useSelector } from "react-redux";
import type { RootStateType } from "@/redux/store";
import { getConfig, slugify } from "@/helper";
import { Link } from "react-router-dom";
import { useConfig } from "@/hooks/useConfig";
import { RemoveCartButton } from "../common/cart-button";
import { Quantity } from "./quantity";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "../common/optimized-image";

interface CartSummaryType {
  sub_total: string;
  tax: string;
  shipping_cost: string;
  discount: string;
  grand_total: string;
  grand_total_value: number;
  coupon_code: string;
  coupon_applied: boolean;
}

interface Props {
  children: React.ReactNode;
  isShowCartItems?: boolean;
  className?: string;
}

export const CartSummary = ({
  children,
  isShowCartItems = false,
  className = "",
}: Props) => {
  const config = useConfig();
  const { data } = useGetCartSummaryQuery();

  const cart = useSelector((state: RootStateType) => state.cart?.items);
  const isActiveCoupon = getConfig(config, "coupon_system")?.value === "1";

  const cartSummary = (data as unknown as CartSummaryType) || {};

  return (
    <Card className={cn("p-4 md:p-6 md:sticky md:top-28 bg-card", className)}>
      <h2 className="text-xl font-bold text-foreground">{"ORDER SUMMERY"}</h2>

      {isShowCartItems && cart?.length > 0 && (
        <div className="flex flex-col gap-2">
          {cart?.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b pb-2">
              <div className="flex gap-1">
                <div className="flex-shrink-0 w-20 h-16 sm:w-24 sm:h-20 relative rounded-lg border overflow-hidden">
                  <OptimizedImage
                    src={item?.image || ""}
                    alt={item?.name}
                    className="absolute w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <Link
                    to={`/products/${item?.productId}/${slugify(item?.name)}`}
                    className="text-foreground text-xs md:text-sm font-medium line-clamp-1 hover:underline hover:text-primary">
                    {item?.name}
                  </Link>
                  <div className="text-foreground flex items-center gap-1.5 text-xs md:text-sm mb-0.5">
                    {"Qty"}: {item?.quantity} | {"Price"}: {item?.mainPrice}
                    {item?.variant && (
                      <>
                        {" "}
                        |{" "}
                        <span className="text-[10px] font-medium rounded text-primary border border-primary px-1">
                          {"Variant"}:{item?.variant}
                        </span>
                      </>
                    )}
                  </div>
                  <Quantity item={item} />
                </div>
              </div>

              <div>
                <RemoveCartButton item={item} type="CHECKOUT" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isActiveCoupon && <Coupon couponCode={cartSummary?.coupon_code} />}

      <div className="space-y-1 md:space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{"Sub Total"}:</span>
          <span className="font-medium">
            {cartSummary?.sub_total || " ৳00.00"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{"Shipping Cost"}:</span>

          <span className="font-medium">
            {cartSummary?.shipping_cost || "৳00.00"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{"Discount"}:</span>
          <span className="text-green-600 font-semibold">
            {cartSummary?.discount || " ৳00.00"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {"Estimated sales tax"}:
          </span>
          <span className="font-medium">{cartSummary?.tax || " ৳00.00"}</span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between text-lg font-bold">
        <span>{"Total Amount"}</span>
        <span>{cartSummary?.grand_total || " ৳00.00"}</span>
      </div>

      {children}
    </Card>
  );
};
