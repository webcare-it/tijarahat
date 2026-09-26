import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";
import { Skeleton } from "@/components/common/skeleton";
import { ImageWithLink } from "@/components/common/image-link";
import type { FlashDealType, HomeBannerPropsType } from "@/type";
import { getConfig, getFormattedBanner, slugify } from "@/helper";
import { HomeSectionTitle } from "@/components/common/section-title";

import { useConfig } from "@/hooks/useConfig";

const PromotionalSection = ({
  isLoading,
  items,
  isShowTitle,
}: HomeBannerPropsType) => {
  if (isLoading) {
    return (
      <div className="w-full mb-15">
        <Skeleton className="w-full aspect-[16/5]" />
      </div>
    );
  }

  if (!items || items?.length === 0) return null;

  return (
    <div className="w-full px-2 md:px-0">
      {isShowTitle && <HomeSectionTitle title="Flash Deal" />}
      <Swiper
        spaceBetween={30}
        effect={"fade"}
        navigation={false}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        speed={1000}
        slidesPerView={1}
        pagination={false}
        modules={[EffectFade, Navigation, Pagination, Autoplay]}
        className="mySwiper">
        {items?.map((item, idx) => (
          <SwiperSlide key={idx}>
            <ImageWithLink item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

interface Props {
  isLoading: boolean;
  banners: FlashDealType[] | [];
}
export const FlashDealSection = ({ isLoading, banners }: Props) => {
  const items = banners?.map((b) => ({
    image: b.banner,
    link: `/flash-deal/${b?.id}/${slugify(b?.title)}`,
  }));

  return (
    <PromotionalSection
      isLoading={isLoading}
      items={items}
      isShowTitle={true}
    />
  );
};

export const PromotionalSectionOne = () => {
  const config = useConfig();
  const bannersConfig = getConfig(config, "home_banner1_images")?.value;
  const linksConfig = getConfig(config, "home_banner1_links")?.value as string;
  const links = JSON.parse(linksConfig || "[]") as string[];

  const processedItems = getFormattedBanner(bannersConfig, links);

  return (
    <PromotionalSection
      isLoading={false}
      items={processedItems}
      isShowTitle={false}
    />
  );
};

export const PromotionalSectionTwo = () => {
  const config = useConfig();
  const bannersConfig = getConfig(config, "home_banner2_images")?.value;
  const linksConfig = getConfig(config, "home_banner2_links")?.value as string;
  const links = JSON.parse(linksConfig || "[]") as string[];

  const processedItems = getFormattedBanner(bannersConfig, links);

  return <PromotionalSection isLoading={false} items={processedItems} />;
};

export const PromotionalSectionThree = () => {
  const config = useConfig();
  const bannersConfig = getConfig(config, "home_banner3_images")?.value;
  const linksConfig = getConfig(config, "home_banner3_links")?.value as string;
  const links = JSON.parse(linksConfig || "[]") as string[];

  const processedItems = getFormattedBanner(bannersConfig, links);

  return <PromotionalSection isLoading={false} items={processedItems} />;
};
