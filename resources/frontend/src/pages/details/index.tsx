import { useGetProductDetails } from "@/api/queries/useProducts";
import { BaseLayout } from "@/components/layout/base-layout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/common/skeleton";
import type { ProductDetailsType } from "@/type";
import { RelatedProducts } from "./related";
import { BreadcrumbWrapper } from "@/components/common/breadcrumb-wrapper";
import { ProductTabs } from "@/pages/details/tabs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ProductDetailsSeo } from "./seo";
import { ProductInfo } from "./info";
import { ImageGallery } from "@/components/common/image-gallery";
import { useState } from "react";
import { ProductCardSkeleton } from "@/components/card/product";
import { CardLayout } from "@/components/common/card-layout";
import { HomeSectionTitleSkeleton } from "@/components/common/section-title";
import { useInitialLength } from "@/hooks/useMobile";

export interface ProductDetailsResponse {
    data: ProductDetailsType[];
    success: boolean;
    status: number;
}

export const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [selectedVariantImage, setSelectedVariantImage] = useState<
        string | null
    >(null);
    const { data, isLoading } = useGetProductDetails(id as string) as {
        data: ProductDetailsResponse | undefined;
        isLoading: boolean;
        error: unknown;
    };

    const product: ProductDetailsType = data?.data?.[0] as ProductDetailsType;

    if (isLoading) return <ProductDetailsSkeleton />;

    if (!data?.data?.[0]) navigate("/products");

    return (
        <>
            <ProductDetailsSeo product={product} />
            <BaseLayout>
                <BreadcrumbWrapper
                    className="my-10 mx-4 md:mx-auto"
                    items={[
                        {
                            title: "Products",
                            path: "/products",
                        },
                        { title: product?.name },
                    ]}
                />
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-8 mx-4 md:mx-auto">
                    <div className="md:col-span-6">
                        <ImageGallery
                            product={product}
                            img={
                                selectedVariantImage
                                    ? selectedVariantImage
                                    : product?.thumbnail_image
                            }
                        />
                    </div>
                    <ProductInfo
                        product={product}
                        onVariantImageChange={setSelectedVariantImage}
                    />
                </div>
                <div className="mb-10 md:mb-16">
                    <ProductTabs product={product} />

                    {product?.tags && product?.tags?.length > 0 && (
                        <div className="mx-4 md:mx-auto mt-4 md:mt-6">
                            <div className="mt-8 flex items-center gap-2">
                                <span className="text-sm font-medium">
                                    Tags:
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {product?.tags?.map((tag, i: number) =>
                                        tag?.trim() ? (
                                            <Link to={`/search?query=${tag}`}>
                                                <Badge
                                                    key={i}
                                                    variant="secondary"
                                                >
                                                    {tag}
                                                </Badge>
                                            </Link>
                                        ) : (
                                            <span
                                                key={i}
                                                className="text-sm font-medium"
                                            >
                                                No Tags
                                            </span>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <RelatedProducts />
            </BaseLayout>
        </>
    );
};

export const ProductDetailsSkeleton = () => {
    const initialLength = useInitialLength();

    return (
        <BaseLayout>
            <div className="my-10 mx-4 md:mx-auto">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-16" />
                    <span className="text-muted-foreground">/</span>
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-8 mx-4 md:mx-auto">
                <div className="md:col-span-6">
                    <div className="space-y-2.5 md:space-y-4 w-full overflow-hidden">
                        <div className="flex gap-1 md:gap-2">
                            <div className="w-12 md:w-20 mb-4 flex flex-col gap-2 max-h-[250px] md:max-h-[620px] overflow-y-auto">
                                {[...Array(4)].map((_, i) => (
                                    <Skeleton
                                        key={i}
                                        className="w-12 h-12 md:w-20 md:h-20 rounded-lg flex-shrink-0"
                                    />
                                ))}
                            </div>
                            <div className="flex-1 relative">
                                <Skeleton className="aspect-[16/17] w-full rounded-xl" />
                                <div className="absolute top-4 right-4">
                                    <Skeleton className="w-10 h-10 rounded-full" />
                                </div>

                                <div className="absolute top-4 left-4">
                                    <Skeleton className="h-6 w-12 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-1.5 md:space-y-4 md:col-span-6">
                    <div>
                        <Skeleton className="h-8 w-3/4 mb-2" />
                        {/* <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Skeleton key={i} className="w-4 h-4" />
                                ))}
                            </div>
                            <Skeleton className="h-4 w-16" />
                        </div> */}
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-6 w-20" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-8 w-20" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-12" />
                        <div className="flex items-center gap-2">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton
                                    key={i}
                                    className="w-6 h-6 md:w-8 md:h-8 rounded-full"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-12" />
                        <div className="flex items-center gap-2">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="w-8 h-8 rounded" />
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-3 h-3 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-16" />
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-8 h-8 rounded" />
                            <Skeleton className="w-12 h-6" />
                            <Skeleton className="w-8 h-8 rounded" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-6 w-2/4 mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="p-2 border rounded-lg">
                                <div className="flex flex-col items-center text-center space-y-2">
                                    <Skeleton className="w-6 h-6" />
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-6 md:mt-8 mx-4 md:mx-auto">
                <div className="w-full">
                    <div className="flex w-full overflow-x-auto">
                        {["Details", "Return Policy", "Video", "Reviews"].map(
                            (_, i) => (
                                <Skeleton
                                    key={i}
                                    className="h-10 w-24 mx-2 flex-shrink-0"
                                />
                            ),
                        )}
                    </div>
                    <div className="mt-6 space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                </div>
            </div>
            <div className="mx-4 md:mx-auto my-4 md:my-6">
                <div className="mt-8 flex items-center gap-2">
                    <Skeleton className="h-5 w-20" />:
                    <div className="flex flex-wrap gap-2">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton
                                key={i}
                                className="h-5 w-24 rounded-full"
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="mb-10 md:mb-20 mt-8 container mx-auto">
                <div className="my-6">
                    <HomeSectionTitleSkeleton />
                </div>
                <CardLayout>
                    {Array.from({ length: initialLength }).map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </CardLayout>
            </div>
        </BaseLayout>
    );
};
