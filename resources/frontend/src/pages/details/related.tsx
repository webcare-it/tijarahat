import type { ProductType } from "@/type";
import { useParams } from "react-router-dom";
import { useGetRelatedProducts } from "@/api/queries/useProducts";
import { ProductCard, ProductCardSkeleton } from "@/components/card/product";
import { CardLayout } from "@/components/common/card-layout";
import { HomeSectionTitle } from "@/components/common/section-title";
import { AnimationWrapper } from "@/components/common/animation-wrapper";

export const RelatedProducts = () => {
  const { id } = useParams();

  const { data, isLoading } = useGetRelatedProducts();
  const products = (data?.data as ProductType[]) || [];

  return (
    <section
      className={`mb-10 md:mb-20 container mx-auto ${
        (products?.length === 0 && !isLoading && "hidden") || (!id && "hidden")
      }`}>
      <HomeSectionTitle title="Related Products" />
      <CardLayout>
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : products?.length > 0 &&
            products?.map((product, i: number) => (
              <AnimationWrapper
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.05 }}>
                <ProductCard key={product.id} product={product} />
              </AnimationWrapper>
            ))}
      </CardLayout>
    </section>
  );
};
