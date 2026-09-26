import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";
import { slugify } from "@/helper";
import { Skeleton } from "@/components/common/skeleton";
import { Link } from "react-router-dom";
import type { CategoryType } from "@/type";
import { OptimizedImage } from "@/components/common/optimized-image";
import { allProduct } from "@/assets";
import { useAllUtility } from "@/api/queries/useAllUtility";

const CategorySkeleton = () => (
    <div className="flex flex-col items-center px-1 mx-1 sm:px-2 sm:mx-2 min-w-fit sm:min-w-0">
        <Skeleton className="w-20 h-16 sm:w-24 sm:h-20 md:w-28 md:h-24 rounded-lg" />
        <Skeleton className="mt-1 sm:mt-2 w-16 sm:w-18 md:w-20 h-3 sm:h-4 rounded" />
    </div>
);

export const CategoriesSection = () => {
    const { data, isLoading } = useAllUtility();

    const categories = (data?.data?.categories?.data as CategoryType[]) || [];
    const totalSlidesCount = (categories?.length || 0) + 1;
    const enableLoop = totalSlidesCount > 10;

    return (
        <section className="w-full">
            <Swiper
                modules={[EffectFade, Navigation, Pagination, Autoplay]}
                loop={enableLoop}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                speed={600}
                centerInsufficientSlides={true}
                slidesPerView={4}
                slidesPerGroup={1}
                spaceBetween={8}
                watchOverflow={true}
                breakpoints={{
                    480: {
                        slidesPerView: 3,
                    },
                    600: {
                        slidesPerView: 3,
                    },
                    1024: {
                        slidesPerView: 6,
                    },
                    1280: {
                        slidesPerView: 8,
                    },
                    1536: {
                        slidesPerView: 10,
                    },
                }}
            >
                <SwiperSlide>
                    <Link
                        to="/products"
                        className="flex flex-col items-center px-1 mx-1 sm:px-2 sm:mx-2 min-w-fit sm:min-w-0 group"
                    >
                        <div className="w-20 h-16 sm:w-24 sm:h-20 md:w-28 md:h-24 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden shadow-md group-hover:bg-primary/20 transition-colors duration-300 relative p-1 sm:p-2">
                            <img
                                src={allProduct}
                                alt="all products"
                                className="w-full h-full object-contain absolute"
                                loading="lazy"
                            />
                        </div>
                        <span className="mt-1 sm:mt-2 text-xs font-medium text-foreground group-hover:text-primary text-center w-20 sm:w-24 md:w-28 line-clamp-1 transition-all duration-300 group-hover:underline">
                            {"All Products"}
                        </span>
                    </Link>
                </SwiperSlide>
                {isLoading
                    ? Array.from({ length: 10 }).map((_, index) => (
                          <SwiperSlide key={index}>
                              <CategorySkeleton />
                          </SwiperSlide>
                      ))
                    : categories &&
                      categories?.length > 0 &&
                      categories?.map((category) => (
                          <SwiperSlide key={category?.id}>
                              <Link
                                  to={`/categories/${category?.id}/${slugify(
                                      category?.name,
                                  )}`}
                                  className="flex flex-col items-center px-1 sm:px-2 mx-2 min-w-fit sm:min-w-0 group"
                                  aria-label={`Explore ${category?.name}`}
                              >
                                  <div className="w-20 h-16 sm:w-24 sm:h-20 md:w-28 md:h-24 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden shadow-md group-hover:bg-primary/20 transition-colors duration-300 relative p-1 sm:p-2 select-none">
                                      <OptimizedImage
                                          src={category?.icon || ""}
                                          alt={category?.name}
                                          className="w-full h-full object-contain absolute"
                                      />
                                  </div>
                                  <span className="mt-1 sm:mt-2 text-xs font-medium text-foreground group-hover:text-primary text-center w-20 sm:w-24 md:w-28 line-clamp-1 transition-all duration-300 group-hover:underline">
                                      {category?.name}
                                  </span>
                              </Link>
                          </SwiperSlide>
                      ))}
            </Swiper>
        </section>
    );
};
