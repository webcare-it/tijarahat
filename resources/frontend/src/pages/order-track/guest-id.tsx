import { SeoWrapper } from "@/components/common/seo-wrapper";
import { BaseLayout } from "@/components/layout/base-layout";
import { HomeSectionTitle } from "@/components/common/section-title";
import { OrderTrackCard } from "./components/order";
import { useGetOrderTrack } from "@/api/queries/useGetOrderTrack";
import { OrderTrackSkeleton } from "./components/skeleton";
import {
  transformApiResponseToOrderData,
  type ApiOrderResponseType,
} from "./components/utils";

export const OrderTrackDetailsGuestPage = () => {
  const { data, isLoading } = useGetOrderTrack();

  const orderData =
    transformApiResponseToOrderData(
      data?.data as unknown as ApiOrderResponseType
    ) || null;

  return (
    <>
      <SeoWrapper title={"Order Track"} />
      <BaseLayout isShowMegaMenu={false}>
        <section className="mb-10 md:mb-20 mt-10 px-4 md:px-0">
          <HomeSectionTitle title="Order Track" />

          <div className="mx-4 md:mx-0">
            {isLoading ? (
              <OrderTrackSkeleton />
            ) : (
              <OrderTrackCard
                orderData={orderData}
                isPending={isLoading}
                path="/track-order"
              />
            )}
          </div>
        </section>
      </BaseLayout>
    </>
  );
};
