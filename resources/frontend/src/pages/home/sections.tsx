import { getConfig } from "@/helper";
import type { HomePropsType } from "@/type";
import { useConfig } from "@/hooks/useConfig";
import { ProductSection } from "@/components/common/product-section";

export const TodaysDealSection = ({ isLoading, products }: HomePropsType) => {
    return (
        <section
            className={`container mx-auto ${
                products?.length === 0 && !isLoading && "hidden"
            }`}
        >
            <ProductSection
                title="Today's Deal"
                products={products}
                isLoading={isLoading}
                path="/products/highlights/todays_deal"
                badge="todays_deal"
            />
        </section>
    );
};

export const NewArrivalsSection = ({ isLoading, products }: HomePropsType) => {
    return (
        <section
            className={`container mx-auto ${
                products?.length === 0 && !isLoading && "hidden"
            }`}
        >
            <ProductSection
                title="New Arrivals"
                products={products}
                isLoading={isLoading}
                path="/products/highlights/new_arrivals"
                badge="new_arrivals"
            />
        </section>
    );
};

export const FeaturedProductsSection = ({
    isLoading,
    products,
}: HomePropsType) => {
    return (
        <section
            className={`container mx-auto ${
                products?.length === 0 && !isLoading && "hidden"
            }`}
        >
            <ProductSection
                title={"Featured Products"}
                products={products}
                isLoading={isLoading}
                path="/products/highlights/featured"
                badge="featured"
            />
        </section>
    );
};

export const BestSellerSection = ({ isLoading, products }: HomePropsType) => {
    const config = useConfig();
    const isShow = getConfig(config, "best_selling")?.value as string;

    return isShow ? (
        <section
            className={`container mx-auto  ${
                products?.length === 0 && !isLoading && "hidden"
            }`}
        >
            <ProductSection
                title={"Best Selling"}
                products={products}
                isLoading={isLoading}
                path="/products/highlights/best_selling"
                badge="best_selling"
            />
        </section>
    ) : null;
};
