import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ImageWithLink } from "@/components/common/image-link";
import { useConfig } from "@/hooks/useConfig";
import { getConfig, getFormattedBanner } from "@/helper";
import { placeholder } from "@/assets";

export const HeroSection = () => {
    const config = useConfig();
    const bannersConfig = getConfig(config, "home_slider_images")?.value;
    const linksConfig = getConfig(config, "home_slider_links")?.value as string;
    const links = JSON.parse(linksConfig || "[]") as string[];

    const items = getFormattedBanner(bannersConfig, links);

    const placeholder_items = [{ image: placeholder, link: null }];

    const banners = items?.length > 0 ? items : placeholder_items;

    return (
        <div className="w-full mt-2 px-2 md:px-0">
            <div className="relative">
                <button className="prev-btn absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1 md:p-2 rounded-full bg-primary/10 text-primary cursor-pointer border border-primary/40">
                    <ChevronLeft className="size-4 md:size-6" />
                </button>
                <button className="next-btn absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1 md:p-2 rounded-full bg-primary/10 text-primary cursor-pointer border border-primary/40">
                    <ChevronRight className="size-4 md:size-6" />
                </button>

                <Swiper
                    slidesPerView={1}
                    spaceBetween={30}
                    loop={true}
                    speed={1000}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    modules={[Pagination, Navigation, Autoplay]}
                    onBeforeInit={(swiper) => {
                        if (
                            typeof swiper.params.navigation === "boolean" ||
                            swiper.params.navigation == null
                        ) {
                            (
                                swiper.params as { navigation?: unknown }
                            ).navigation = {} as unknown as Record<
                                string,
                                unknown
                            >;
                        }
                        const nav = swiper.params.navigation as Record<
                            string,
                            unknown
                        >;
                        nav.prevEl = ".prev-btn";
                        nav.nextEl = ".next-btn";
                    }}
                    navigation={{ prevEl: ".prev-btn", nextEl: ".next-btn" }}
                    className="mySwiper"
                >
                    {banners?.map((item, idx) => (
                        <SwiperSlide key={idx}>
                            <ImageWithLink item={item} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};
