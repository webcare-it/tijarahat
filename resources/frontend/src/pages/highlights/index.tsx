import { ProductCard, ProductCardSkeleton } from "@/components/card/product";
import { CardLayout } from "@/components/common/card-layout";
import { NoDataFound } from "@/components/common/no-data-found";
import { HomeSectionTitle } from "@/components/common/section-title";
import { SeoWrapper } from "@/components/common/seo-wrapper";
import { BaseLayout } from "@/components/layout/base-layout";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useEffect, useState, useMemo, useRef } from "react";
import type { ProductType } from "@/type";
import type { PaginationDataType } from "@/components/common/pagination-wrapper";
import { useParams } from "react-router-dom";
import { formatProductType } from "@/helper";
import { useGetHighlightProducts } from "@/api/queries/useProducts";

export const HighlightsPage = () => {
    const params = useParams();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [allProducts, setAllProducts] = useState<ProductType[]>([]);

    useEffect(() => {
        setAllProducts([]);
        setPage(1);
        setHasMore(true);
    }, []);

    const queryFilters = useMemo(() => ({ page }), [page]);

    const { data, isLoading } = useGetHighlightProducts(queryFilters);

    useEffect(() => {
        if (!data?.data) return;

        const newProducts = (data.data as ProductType[]) || [];
        setAllProducts((prev) => [...prev, ...newProducts]);

        const meta = data.meta as PaginationDataType;
        if (meta?.current_page >= meta?.last_page) {
            setHasMore(false);
        }
    }, [data]);

    const { ref: loadMoreRef, isIntersecting } = useIntersectionObserver({
        threshold: 0.1,
        rootMargin: "100px",
    });

    const isFetchingRef = useRef(false);

    useEffect(() => {
        if (!isIntersecting || !hasMore || isLoading || isFetchingRef.current)
            return;

        isFetchingRef.current = true;
        setPage((prev) => prev + 1);

        setTimeout(() => {
            isFetchingRef.current = false;
        }, 1000);
    }, [isIntersecting, hasMore, isLoading]);

    const isInitialLoading = isLoading && page === 1;
    const isLoadingMore = isLoading && page > 1;

    const title =
        formatProductType((params?.slug as string) || "highlights") ||
        "Highlights";

    return (
        <>
            <SeoWrapper title={title} />
            <BaseLayout>
                <div className="mt-8 md:mt-10 mb-4">
                    <HomeSectionTitle title={`${title} Products`} />
                </div>

                {isInitialLoading ? (
                    <CardLayout>
                        {Array.from({ length: 12 }).map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </CardLayout>
                ) : allProducts.length > 0 ? (
                    <CardLayout>
                        {allProducts.map((product, i) => (
                            <ProductCard
                                product={product}
                                key={`${product.id}-${i}`}
                                badge={params?.slug}
                            />
                        ))}
                    </CardLayout>
                ) : (
                    <NoDataFound title="No products found" />
                )}

                <div
                    ref={loadMoreRef}
                    className="py-16 flex justify-center min-h-[80px]"
                >
                    {allProducts.length > 0 && (
                        <div>
                            {isLoadingMore && hasMore && (
                                <div className="flex items-center gap-3 text-gray-500">
                                    <div className="w-5 h-5 border-2 border-t-blue-500 rounded-full animate-spin" />
                                    Loading more products...
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </BaseLayout>
        </>
    );
};
