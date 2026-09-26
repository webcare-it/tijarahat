import { SectionTitle } from "@/components/common/section-title";
import { SeoWrapper } from "@/components/common/seo-wrapper";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { BreadcrumbWrapper } from "@/components/common/breadcrumb-wrapper";
import { useGetOrdersQuery } from "@/api/queries/userOrders";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NoDataFound } from "@/components/common/no-data-found";
import { Skeleton } from "@/components/common/skeleton";
import type { OrderType } from "@/type";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Eye, Truck } from "lucide-react";
import {
  PaginationWrapper,
  type PaginationDataType,
} from "@/components/common/pagination-wrapper";
import { TooltipWrapper } from "@/components/common/tooltip-wrapper";

export const OrdersPage = () => {
  const [filters, setFilters] = useState<Record<string, unknown>>({ page: 1 });
  const { data, isLoading } = useGetOrdersQuery(filters);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const orders = (data?.data as OrderType[]) || [];
  const pagination = (data as { meta: PaginationDataType })?.meta || {};

  return (
    <>
      <SeoWrapper title={"My Orders"} />
      <DashboardLayout>
        <div className="mx-4 md:mx-0 mb-4">
          <BreadcrumbWrapper
            type="dashboard"
            items={[{ title: "My Orders" }]}
          />
        </div>
        <SectionTitle title={"My Orders"} />

        <Card className="py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-2 md:pl-4">{"Code"}</TableHead>
                <TableHead>{"Date"}</TableHead>
                <TableHead>{"Payment Status"}</TableHead>
                <TableHead>{"Payment Type"}</TableHead>
                <TableHead>{"Delivery Status"}</TableHead>
                <TableHead> {"Total"}</TableHead>
                <TableHead className="text-right pr-2 md:pr-4">
                  {"Action"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    <TableCell className="pl-2 md:pl-4">
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-28 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-36 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell className="text-right pr-2 md:pr-4 w-20">
                      <div className="flex justify-end">
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : orders?.length > 0 ? (
                orders?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium pl-2 md:pl-4">
                      {order?.code}
                    </TableCell>
                    <TableCell>{order?.date}</TableCell>
                    <TableCell>
                      <Badge>{order?.payment_status}</Badge>
                    </TableCell>
                    <TableCell>{order?.payment_type}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {order?.delivery_status_string}
                      </Badge>
                    </TableCell>
                    <TableCell>{order?.grand_total}</TableCell>
                    <TableCell className="text-right pr-2 md:pr-4 w-20">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/dashboard/track-order/${order?.code}`}>
                          <TooltipWrapper text={"Track Order"}>
                            <Button variant="ghost" size="sm">
                              <Truck className="h-4 w-4 text-purple-600" />
                            </Button>
                          </TooltipWrapper>
                        </Link>
                        <Link to={`/dashboard/orders/${order?.id}`}>
                          <TooltipWrapper text={"View Order"}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 text-blue-600" />
                            </Button>
                          </TooltipWrapper>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>
                    <NoDataFound
                      height="min-h-[200px]"
                      title={"No orders yet"}
                      description={
                        "You haven’t placed any orders. Browse products and start your first purchase."
                      }
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow className="w-full">
                <TableCell colSpan={7}>
                  <div className="w-full flex justify-end">
                    {Object.keys(pagination)?.length > 0 &&
                      orders?.length > 0 && (
                        <PaginationWrapper
                          className=""
                          paginationData={pagination}
                          onPageChange={handlePageChange}
                        />
                      )}
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </Card>
      </DashboardLayout>
    </>
  );
};
