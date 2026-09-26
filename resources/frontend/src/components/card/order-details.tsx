import type { InvoiceType } from "@/type";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Contact, Eye, MapPin } from "lucide-react";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";
import { keyToValue, slugify } from "@/helper";

import { Skeleton } from "../common/skeleton";
import { NoDataFound } from "../common/no-data-found";
import { TooltipWrapper } from "../common/tooltip-wrapper";
import { Button } from "../ui/button";
import { OptimizedImage } from "../common/optimized-image";

export const OrderDetailsCard = ({
  order,
  path,
}: {
  order: InvoiceType;
  path: string;
}) => {
  if (!order) {
    return <NoDataFound />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="space-y-6">
          <Card className="shadow-lg p-0">
            <CardContent className="space-y-2 md:space-y-3 p-2 md:p-4">
              <div className="flex items-center gap-3">
                <Avatar className="border border-green-500">
                  <AvatarImage src={undefined} />
                  <AvatarFallback>
                    {order?.shipping_address?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {order?.shipping_address?.name && (
                  <p className="text-sm font-medium text-foreground">
                    {order?.shipping_address?.name}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm font-medium border-t pt-2">
                <Contact className="w-4 h-4 text-muted-foreground" />
                <span>
                  {order?.shipping_address?.phone ||
                    order?.shipping_address?.email ||
                    "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium border-t pt-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{order?.shipping_address?.address}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg p-0">
            <CardContent className="space-y-2 md:space-y-3 p-2 md:p-4">
              {order?.order_items?.map((item, index: number) => (
                <div
                  className="flex gap-4 border-b pb-0.5 last:border-b-0"
                  key={index}>
                  <div className="w-16 h-16 md:w-20 md:h-20 relative rounded-lg flex overflow-hidden items-center justify-center">
                    <OptimizedImage
                      src={item?.product_thumbnail_image || ""}
                      className="absolute w-full h-full object-cover"
                      alt={item?.product_name}
                    />
                  </div>
                  <div className="flex-1">
                    <Link
                      to={`/products/${item?.product_id}/${slugify(
                        item?.product_name
                      )}`}
                      className="font-semibold line-clamp-1 text-foreground text-base md:text-lg hover:underline">
                      {item?.product_name}
                    </Link>
                    {item?.variation && (
                      <Badge variant="outline" className="text-xs">
                        {item?.variation}
                      </Badge>
                    )}
                    <div className="flex items-center gap-2 text-xs md:text-sm text-foreground font-medium">
                      {"Quantity"}:
                      <span className="font-bold">{item?.quantity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs md:text-sm text-foreground font-medium">
                      {"Price"}:
                      <span className="font-bold"> {item?.price || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}>
          <Card className="shadow-lg p-0 gap-4">
            <CardContent className="space-y-4 p-3 md:p-4">
              <h2 className="text-lg font-bold">{"Invoice Details"}</h2>
              <div className="flex gap-2 items-center">
                <div className="text-sm text-muted-foreground">
                  {"Transaction ID"}: {order?.order_code || "N/A"}
                </div>
                <Link to={`${path}/${order?.order_code}`}>
                  <TooltipWrapper text={"Track Order"}>
                    <Button variant="ghost" size="icon" className="size-8">
                      <Eye className="w-4 h-4 text-blue-600" />
                    </Button>
                  </TooltipWrapper>
                </Link>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>{"Order Date"}:</span>
                  <span>{order?.order_date || "N/A"}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span>{"Order Status"}:</span>
                  <Badge className="text-xs uppercase font-medium">
                    {order?.order_status || "N/A"}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span>{"Payment Method"}:</span>
                  <span>{keyToValue(order?.payment_method || "")}</span>
                </div>
                <div className="flex justify-between text-blue-600 text-sm font-medium">
                  <span>{"Shipping Cost"}:</span>
                  <span>{order?.shipping_cost || 0}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span>{"Sub Total"}:</span>
                  <span>{order?.subtotal || 0}</span>
                </div>

                <div className="border-t pt-2 z-10 text-sm">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>{"Order Total"}:</span>
                    <span>{order?.grand_total || 0}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export const OrderDetailsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-2 md:space-y-3">
          <Card className="shadow-lg p-0">
            <CardContent className="space-y-2 md:space-y-3 p-2 md:p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center gap-2 border-t pt-2">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex items-center gap-2 border-t pt-2">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="h-4 w-48" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg p-0">
            <CardContent className="space-y-2 md:space-y-3 p-2 md:p-4">
              {[1, 2, 3].map((item) => (
                <div className="flex gap-4" key={item}>
                  <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="shadow-lg p-0 gap-4">
          <CardContent className="space-y-4 p-3 md:p-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-40" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>

              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
