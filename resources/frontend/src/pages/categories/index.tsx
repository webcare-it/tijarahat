import { HomeSectionTitle } from "@/components/common/section-title";
import { AnimationWrapper } from "@/components/common/animation-wrapper";
import { NoDataFound } from "@/components/common/no-data-found";
import { BaseLayout } from "@/components/layout/base-layout";
import { SeoWrapper } from "@/components/common/seo-wrapper";
import { CategoryCard, CategoryCardSkeleton } from "@/components/card/category";
import { MobileCategory } from "@/components/card/mobile-category";
import type { CategoryType } from "@/components/layout/header/useMenu";
import { useAllUtility } from "@/api/queries/useAllUtility";

export const CategoriesPage = () => {
    const { data, isLoading } = useAllUtility();
    const categories = (data?.data?.categories?.data as CategoryType[]) || [];

    return (
        <>
            <SeoWrapper title="All Categories" />

            <BaseLayout>
                <section className="mb-10 md:mb-20 container mx-auto mt-6 md:mt-10">
                    <HomeSectionTitle title="All Categories" />

                    <div className="block md:hidden mt-6 mx-4">
                        <MobileCategory
                            categories={categories}
                            isLoading={isLoading}
                        />
                    </div>

                    <div className="hidden md:grid grid-cols-2 gap-2 md:gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 mx-4 md:mx-0">
                        {isLoading ? (
                            Array.from({ length: 14 }).map((_, i) => (
                                <CategoryCardSkeleton key={i} />
                            ))
                        ) : categories?.length > 0 ? (
                            categories?.map((category, i: number) => (
                                <AnimationWrapper
                                    key={category.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: i * 0.05,
                                    }}
                                >
                                    <CategoryCard category={category} />
                                </AnimationWrapper>
                            ))
                        ) : (
                            <div className="col-span-full">
                                <NoDataFound title={"No categories found"} />
                            </div>
                        )}
                    </div>
                </section>
            </BaseLayout>
        </>
    );
};
