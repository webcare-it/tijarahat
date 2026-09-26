import {
    HomeSectionTitle,
    HomeSectionTitleSkeleton,
} from "@/components/common/section-title";
import type { ProductType } from "@/type";
import { CardLayout } from "@/components/common/card-layout";
import { ProductCard, ProductCardSkeleton } from "@/components/card/product";
import { useInitialLength } from "@/hooks/useMobile";

interface Props {
    title: string;
    isLoading: boolean;
    products: ProductType[] | [];
    path: string;
    badge?: string;
}

export const ProductSection = ({
    isLoading,
    products,
    title,
    path = "",
    badge = "",
}: Props) => {
    const initialLength = useInitialLength();

    const productsToShow = products?.slice(0, initialLength);

    if (isLoading)
        return (
            <div className="w-full">
                <div className="my-6">
                    <HomeSectionTitleSkeleton />
                </div>

                <CardLayout>
                    {Array.from({ length: initialLength }).map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </CardLayout>
            </div>
        );

    if (!products || products?.length === 0) return null;

    return (
        <HomeSectionTitle title={title} href={path}>
            <CardLayout>
                {productsToShow?.map((product) => (
                    <ProductCard
                        key={product?.id}
                        product={product}
                        badge={badge}
                    />
                ))}
            </CardLayout>
        </HomeSectionTitle>
    );
};
