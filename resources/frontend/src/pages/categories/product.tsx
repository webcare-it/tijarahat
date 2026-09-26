import { useGetProductsByCategory } from "@/api/queries/useProducts";
import type { ProductType } from "@/type";
import { useParams } from "react-router-dom";
import { slugifyToTitle } from "@/helper";
import { SeoWrapper } from "@/components/common/seo-wrapper";
import type { PaginationDataType } from "@/components/common/pagination-wrapper";
import { useEffect, useState, useMemo, useRef } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { BaseLayout } from "@/components/layout/base-layout";
import { HomeSectionTitle } from "@/components/common/section-title";
import { CardLayout } from "@/components/common/card-layout";
import { ProductCard, ProductCardSkeleton } from "@/components/card/product";
import { NoDataFound } from "@/components/common/no-data-found";

const useCategoryInfiniteScroll = (id: string) => {
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const queryFilters = useMemo(() => ({ page }), [page]);
  const { data, isLoading } = useGetProductsByCategory(id, queryFilters);

  useEffect(() => {
    setAllProducts([]);
    setPage(1);
    setHasMore(true);
  }, [id]);

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

const CategoryProductsList = ({ id, title }: { id: string; title: string }) => {
  const { allProducts, hasMore, isInitialLoading, isLoadingMore, loadMoreRef } =
    useCategoryInfiniteScroll(id);

  return (
    <BaseLayout>
      <section className="mb-10 md:mb-14 container mx-auto mt-10">
        <HomeSectionTitle title={title} />
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
          className="py-6 flex justify-center min-h-[80px]">
          {allProducts.length > 0 && isLoadingMore && hasMore && (
            <div className="flex items-center gap-3 text-gray-500">
              <div className="w-5 h-5 border-2 border-t-blue-500 rounded-full animate-spin" />
              Loading more products...
            </div>
          )}
        </div>
      </section>
    </BaseLayout>
  );
};

export const CategoriesProductPage = () => {
  const { id, name } = useParams();
  return (
    <>
      <SeoWrapper title={slugifyToTitle(name as string)} />
      <CategoryProductsList
        id={id as string}
        title={slugifyToTitle(name as string)}
      />
    </>
  );
};

export const CategoriesSubCategoryProductPage = () => {
  const { subId, subName } = useParams();
  return (
    <>
      <SeoWrapper title={slugifyToTitle(subName as string)} />
      <CategoryProductsList
        id={subId as string}
        title={slugifyToTitle(subName as string)}
      />
    </>
  );
};

export const CategoriesSubSubCategoryProductPage = () => {
  const { subSubId, subSubName } = useParams();
  return (
    <>
      <SeoWrapper title={slugifyToTitle(subSubName as string)} />
      <CategoryProductsList
        id={subSubId as string}
        title={slugifyToTitle(subSubName as string)}
      />
    </>
  );
};
