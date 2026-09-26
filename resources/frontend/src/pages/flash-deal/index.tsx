import { useGetProductsByFlashDeal } from "@/api/queries/useProducts";
import type { FlashDealType, ProductType } from "@/type";
import { CardLayout } from "@/components/common/card-layout";
import { ProductCard, ProductCardSkeleton } from "@/components/card/product";
import { AnimationWrapper } from "@/components/common/animation-wrapper";
import { NoDataFound } from "@/components/common/no-data-found";
import { BaseLayout } from "@/components/layout/base-layout";
import { SeoWrapper } from "@/components/common/seo-wrapper";
import { ImageWithLink } from "@/components/common/image-link";
import { Skeleton } from "@/components/common/skeleton";
import { useEffect, useMemo, useState } from "react";

const CountdownTimer = ({ endTimestamp }: { endTimestamp: number }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeLeft = useMemo(() => {
    const difference = endTimestamp * 1000 - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, [now, endTimestamp]);

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="flex justify-center mt-6 gap-2 md:gap-4">
      {["days", "hours", "minutes", "seconds"]
        .map((unit) => (
          <div key={unit} className="text-center">
            <div className="bg-primary text-primary-foreground font-bold text-xl md:text-3xl lg:text-4xl rounded-lg px-3 py-2 md:px-6 md:py-4 min-w-[60px] md:min-w-[100px]">
              {formatNumber(timeLeft[unit as keyof typeof timeLeft])}
            </div>
          </div>
        ))
        .reduce<React.ReactNode>(
          (acc, curr) =>
            acc === null ? (
              curr
            ) : (
              <>
                {acc}
                <span className="text-3xl md:text-4xl font-bold text-primary self-center mx-1">
                  :
                </span>
                {curr}
              </>
            ),
          null
        )}
    </div>
  );
};

export const FlashDealPage = () => {
  const { data, isLoading } = useGetProductsByFlashDeal();

  const products = (data?.products?.data as ProductType[]) || [];
  const flashDeal = data?.flash_deal?.data?.[0] as FlashDealType;

  return (
    <>
      <SeoWrapper title={"Flash Deal"} />

      <BaseLayout>
        <section className="mb-10 md:mb-20 container mx-auto mt-2">
          <div className="mb-10">
            {isLoading ? (
              <div>
                <Skeleton className="w-full aspect-[16/5]" />

                <div className="flex flex-col items-center mt-6">
                  <Skeleton className="w-xs h-12" />
                  <div className="flex justify-center mt-6 gap-2 md:gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton
                        key={i}
                        className="w-16 md:24 h-12 md:h-16 rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="mx-2">
                  <ImageWithLink
                    item={{ image: flashDeal?.banner?.trim() || "", link: "" }}
                  />
                </div>
                <div className="flex justify-center mt-6">
                  <h2 className="text-lg line-clamp-1 font-bold md:text-3xl lg:text-4xl text-primary tracking-tight flex text-center">
                    {flashDeal?.title}
                  </h2>
                </div>
                {flashDeal?.date && (
                  <CountdownTimer endTimestamp={flashDeal?.date} />
                )}
              </>
            )}
          </div>

          <CardLayout>
            {isLoading ? (
              Array.from({ length: 12 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            ) : products?.length > 0 ? (
              products?.map((product, i: number) => (
                <AnimationWrapper
                  key={product.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}>
                  <ProductCard key={product.id} product={product} />
                </AnimationWrapper>
              ))
            ) : (
              <div className="col-span-full px-4">
                <NoDataFound title={"No products found"} />
              </div>
            )}
          </CardLayout>
        </section>
      </BaseLayout>
    </>
  );
};
