import { useGetProductsForHome } from "@/api/queries/useProducts";
import type { ProductType } from "@/type";
import { HomeSectionTitle } from "@/components/common/section-title";
import { CardLayout } from "@/components/common/card-layout";
import { ProductCard, ProductCardSkeleton } from "@/components/card/product";
import { useSearchParams } from "react-router-dom";
import { NoDataFound } from "@/components/common/no-data-found";
import { BaseLayout } from "@/components/layout/base-layout";
import { SeoWrapper } from "@/components/common/seo-wrapper";
import type { PaginationDataType } from "@/components/common/pagination-wrapper";
import { useEffect, useState, useMemo, useRef } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const useSearchInfiniteScroll = (query: string, type: string) => {
    const [page, setPage] = useState(1);
    const [allProducts, setAllProducts] = useState<ProductType[]>([]);
    const [hasMore, setHasMore] = useState(true);

    const params = useMemo(
        () => ({ query_key: query, ...(type.trim() ? { type } : {}), page }),
        [query, type, page]
    );

    const { data, isLoading } = useGetProductsForHome("search", params);

    useEffect(() => {
        setAllProducts([]);
        setPage(1);
        setHasMore(true);
    }, [query, type]);

    useEffect(() => {
        if (!data?.data) return;
        const newProducts = (data.data as ProductType[]) || [];
        setAllProducts((prev) => [...prev, ...newProducts]);
        const meta = data.meta as PaginationDataType;
        if (meta?.current_page >= meta?.last_page) setHasMore(false);
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

    return {
        allProducts,
        hasMore,
        isInitialLoading: isLoading && page === 1,
        isLoadingMore: isLoading && page > 1,
        loadMoreRef,
    };
};

export const SearchPage = () => {
    const [searchParams] = useSearchParams();

    const type = searchParams.get("type") || "";
    const query = searchParams.get("query") || "";

    const {
        allProducts,
        hasMore,
        isInitialLoading,
        isLoadingMore,
        loadMoreRef,
    } = useSearchInfiniteScroll(query, type);

    return (
        <>
            <SeoWrapper
                title={`Search results for "${query?.toUpperCase()}"`}
            />

            <BaseLayout>
                <section className="mb-10 md:mb-20 container mx-auto mt-10">
                    <HomeSectionTitle
                        title={`Search results for "${query?.toUpperCase()}"`}
                    />
                    <CardLayout>
                        {isInitialLoading ? (
                            Array.from({ length: 12 }).map((_, i) => (
                                <ProductCardSkeleton key={i} />
                            ))
                        ) : allProducts.length > 0 ? (
                            allProducts.map((product, i) => (
                                <ProductCard
                                    product={product}
                                    key={`${product.id}-${i}`}
                                />
                            ))
                        ) : (
                            <div className="col-span-full px-4">
                                <NoDataFound title="No products found" />
                            </div>
                        )}
                    </CardLayout>

                    <div
                        ref={loadMoreRef}
                        className="py-6 flex justify-center min-h-[80px]"
                    >
                        {allProducts.length > 0 && isLoadingMore && hasMore && (
                            <div className="flex items-center gap-3 text-gray-500">
                                <div className="w-5 h-5 border-2 border-t-blue-500 rounded-full animate-spin" />
                                Loading more products...
                            </div>
                        )}
                    </div>
                </section>
            </BaseLayout>
        </>
    );
};
