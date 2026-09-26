import { useGetProductsByBrand } from "@/api/queries/useProducts";
import type { PaginationDataType } from "@/components/common/pagination-wrapper";
import { SeoWrapper } from "@/components/common/seo-wrapper";
import { slugifyToTitle } from "@/helper";
import type { ProductType } from "@/type";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { BaseLayout } from "@/components/layout/base-layout";
import { HomeSectionTitle } from "@/components/common/section-title";
import { CardLayout } from "@/components/common/card-layout";
import { ProductCard, ProductCardSkeleton } from "@/components/card/product";
import { NoDataFound } from "@/components/common/no-data-found";

export const BrandsPage = () => {
  const { name } = useParams();
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, isLoading } = useGetProductsByBrand({ page });

  useEffect(() => {
    if (!data?.data) return;
    const newProducts = (data.data as ProductType[]) || [];
    setAllProducts((prev) => [...prev, ...newProducts]);
    const meta = data?.meta as PaginationDataType;
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

  const isInitialLoading = isLoading && page === 1;
  const isLoadingMore = isLoading && page > 1;

  return (
    <>
      <SeoWrapper title={slugifyToTitle(name as string)} />
      <BaseLayout>
        <section className="mb-10 md:mb-20 container mx-auto mt-10">
          <HomeSectionTitle title={slugifyToTitle(name as string)} />
          <CardLayout>
            {isInitialLoading ? (
              Array.from({ length: 12 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            ) : allProducts.length > 0 ? (
              allProducts.map((product, i) => (
                <ProductCard product={product} key={`${product.id}-${i}`} />
              ))
            ) : (
              <div className="col-span-full px-4">
                <NoDataFound title="No products found" />
              </div>
            )}
          </CardLayout>

          <div
            ref={loadMoreRef}
            className="py-16 flex justify-center min-h-[80px]">
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
