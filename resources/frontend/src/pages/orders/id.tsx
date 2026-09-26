import { SeoWrapper } from "@/components/common/seo-wrapper";
import { useGetUserOrderDetails } from "@/api/queries/userOrders";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import type { InvoiceType } from "@/type";
import { BreadcrumbWrapper } from "@/components/common/breadcrumb-wrapper";
import { SectionTitle } from "@/components/common/section-title";
import {
  OrderDetailsCard,
  OrderDetailsSkeleton,
} from "@/components/card/order-details";

export const OrderDetailsPage = () => {
  const { data, isLoading } = useGetUserOrderDetails();
  const order = (data?.data?.[0] as InvoiceType) || {};

  return (
    <>
      <SeoWrapper title={"Order Details"} />
      <DashboardLayout>
        <div className="mx-4 md:mx-0 mb-4">
          <BreadcrumbWrapper
            type="dashboard"
            items={[
              {
                title: "My Orders",
                path: "/dashboard/orders",
              },
              {
                title: `${"Order Details"} #${order?.order_code}`,
              },
            ]}
          />
        </div>

        <SectionTitle title={"Order Details"} />
        {isLoading ? (
          <OrderDetailsSkeleton />
        ) : (
          <div className="mx-4 md:mx-0">
            <OrderDetailsCard order={order} path="/dashboard/track-order" />
          </div>
        )}
      </DashboardLayout>
    </>
  );
};
