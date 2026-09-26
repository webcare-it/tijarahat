import { SeoWrapper } from "@/components/common/seo-wrapper";

import { SectionTitle } from "@/components/common/section-title";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { BreadcrumbWrapper } from "@/components/common/breadcrumb-wrapper";
import { OrderTrackCard } from "./components/order";
import { useNavigate, useParams } from "react-router-dom";
import { useGetOrderTrack } from "@/api/queries/useGetOrderTrack";
import { transformApiResponseToOrderData } from "./components/utils";
import type { ApiOrderResponseType } from "./components/utils";
import { OrderTrackSkeleton } from "./components/skeleton";

export const OrderTrackIdPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetOrderTrack();

  const orderData =
    transformApiResponseToOrderData(
      data?.data as unknown as ApiOrderResponseType
    ) || null;

  if (!id) navigate("/order-track");

  return (
    <>
      <SeoWrapper title={`Track Order ${id ? ": " + id : ""}`} />
      <DashboardLayout>
        <div className="mx-4 md:mx-0 mb-4">
          <BreadcrumbWrapper
            type="dashboard"
            items={[
              {
                title: "Track Order",
                path: "/dashboard/track-order",
              },
              {
                title: `Track Order ${id ? ": " + id : ""}`,
              },
            ]}
          />
        </div>
        <SectionTitle title={`Track Order ${id ? ": " + id : ""}`} />

        <div className="mx-4 md:mx-0">
          {isLoading ? (
            <OrderTrackSkeleton />
          ) : (
            <OrderTrackCard
              orderData={orderData}
              isPending={isLoading}
              path="/dashboard/track-order"
            />
          )}
        </div>
      </DashboardLayout>
    </>
  );
};
