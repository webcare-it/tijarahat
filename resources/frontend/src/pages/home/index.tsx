import { HeroSection } from "./hero";
import { BaseLayout } from "@/components/layout/base-layout";
import { CategoriesSection } from "./categories";
import {
    FlashDealSection,
    PromotionalSectionOne,
    PromotionalSectionThree,
    PromotionalSectionTwo,
} from "./promotional";
import {
    BestSellerSection,
    FeaturedProductsSection,
    NewArrivalsSection,
    TodaysDealSection,
} from "./sections";
import { CategoryProductsSection } from "./category";
import { TrustBadgeSection } from "./trust-badge";
import { removeLocalStorage } from "@/helper";
import React, { useEffect, useMemo } from "react";
import { useGetHomeProducts } from "@/api/queries/useGetHome";

export const HomePage = () => {
    const { data: homeSections, sectionLoading } = useGetHomeProducts();

    useEffect(() => {
        removeLocalStorage("coupon_code");
        removeLocalStorage("order_completed");
    }, []);

    const orderedSections = useMemo(() => {
        return [
            { key: "hero", component: <HeroSection /> },
            { key: "categories", component: <CategoriesSection /> },
            { key: "trust_badge", component: <TrustBadgeSection /> },
            {
                key: "best_seller_section",
                component: (
                    <BestSellerSection
                        isLoading={sectionLoading}
                        products={homeSections?.best_selling?.data || []}
                    />
                ),
            },
            {
                key: "promotional_section_one",
                component: <PromotionalSectionOne />,
            },
            {
                key: "new_arrivals",
                component: (
                    <NewArrivalsSection
                        isLoading={sectionLoading}
                        products={homeSections?.new_arrivals?.data || []}
                    />
                ),
            },
            {
                key: "todays_deal",
                component: (
                    <TodaysDealSection
                        isLoading={sectionLoading}
                        products={homeSections?.todays_deal?.data || []}
                    />
                ),
            },

            {
                key: "flash_deal_section",
                component: (
                    <FlashDealSection
                        isLoading={sectionLoading}
                        banners={homeSections?.flash_deal?.data || []}
                    />
                ),
            },
            {
                key: "category_products_section",
                component: (
                    <CategoryProductsSection
                        isLoading={sectionLoading}
                        items={homeSections?.category_products || []}
                    />
                ),
            },
            {
                key: "promotional_section_two",
                component: <PromotionalSectionTwo />,
            },
            {
                key: "featured_products_section",
                component: (
                    <FeaturedProductsSection
                        isLoading={sectionLoading}
                        products={homeSections?.featured?.data || []}
                    />
                ),
            },
            {
                key: "promotional_section_three",
                component: <PromotionalSectionThree />,
            },
        ];
    }, [homeSections, sectionLoading]);

    return (
        <BaseLayout isShowNewsletterSection={true}>
            <section className="flex flex-col gap-6 md:gap-16">
                {orderedSections.map((section) => (
                    <React.Fragment key={section.key}>
                        {section.component}
                    </React.Fragment>
                ))}
            </section>
        </BaseLayout>
    );
};
