import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { slugify } from "@/helper";
import type { OrderDataType } from "./utils";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipWrapper } from "@/components/common/tooltip-wrapper";
import { OptimizedImage } from "@/components/common/optimized-image";

export const OrderTrackDetails = ({
  orderData,
  path,
}: {
  path: string;
  orderData: OrderDataType;
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:col-span-2">
        <Card className="shadow-lg py-0">
          <CardContent className="p-4 md:p-6 ">
            <h2 className="text-xl font-bold mb-4">{"Order Items"}</h2>
            <div className="space-y-4">
              {orderData?.order_items?.map((item, index) => (
                <motion.div
                  key={item?.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                  }}
                  className="flex gap-4 pb-4 border-b last:border-0">
                  <div className="relative size-20 md:size-24 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border">
                    <OptimizedImage
                      src={item?.product_thumbnail_image || ""}
                      alt={item?.product_name}
                      className="w-full h-full object-cover rounded-lg absolute"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item?.product_id}/${slugify(
                        item?.product_name
                      )}`}
                      className="font-semibold text-base md:text-lg text-foreground hover:underline line-clamp-2">
                      {item?.product_name}
                    </Link>
                    {item?.variation && (
                      <Badge variant="outline" className="text-xs">
                        {item?.variation}
                      </Badge>
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Quantity:</span>
                        <span className="font-semibold text-foreground">
                          {item?.quantity}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Price:</span>
                        <span className="font-semibold text-foreground">
                          {item?.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}>
        <Card className="shadow-lg sticky top-4">
          <CardContent className="p-4 md:p-6">
            <h2 className="text-xl font-bold mb-4">{"Order Summary"}</h2>

            <div className="space-y-4">
              <div className="space-y-2 pb-4 border-b">
                <div className="text-sm flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">{"Order Code"}:</span>
                  <div className="flex items-center gap-2">
                    <Link to={`${path}/${orderData?.order_code}`}>
                      <TooltipWrapper text="Track Order">
                        <Button variant="ghost" size="icon" className="size-8">
                          <Eye className="w-4 h-4 text-blue-600" />
                        </Button>
                      </TooltipWrapper>
                    </Link>

                    <p className="font-semibold text-foreground">
                      {orderData?.order_code}
                    </p>
                  </div>
                </div>
                <div className="text-sm flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">{"Order Date"}:</span>
                  <p className="font-semibold text-foreground">
                    {orderData?.order_date}
                  </p>
                </div>
                <div className="text-sm flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <p className="font-semibold text-foreground">
                    {orderData?.payment_method}
                  </p>
                </div>
              </div>

              <div className="pb-4 border-b">
                <h3 className="text-sm font-semibold mb-2">Shipping Address</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="font-medium text-muted-foreground flex items-start gap-2">
                    Name:
                    <span className="font-medium text-foreground">
                      {orderData?.shipping_address?.name}
                    </span>
                  </p>
                  <p className="font-medium text-muted-foreground flex items-start gap-2">
                    Phone:
                    <span className="font-medium text-foreground">
                      {orderData?.shipping_address?.phone}
                    </span>
                  </p>
                  <p className="font-medium text-muted-foreground flex items-start gap-2">
                    Address:
                    <span className="font-medium text-foreground">
                      {orderData?.shipping_address?.address}
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-foreground">Subtotal:</span>
                  <span className="font-medium text-foreground">
                    {orderData?.sub_total || "৳00.00"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-foreground">Shipping Cost:</span>
                  <span className="font-medium text-foreground">
                    {orderData?.shipping_cost || "৳00.00"}
                  </span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="font-semibold text-lg text-foreground">
                      Total:
                    </span>
                    <span className="font-bold text-lg text-primary">
                      {orderData?.grand_total || "৳00.00"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
