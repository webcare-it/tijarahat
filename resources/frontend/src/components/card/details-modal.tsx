import { useGetProductDetails } from "@/api/queries/useProducts";
import type { ProductDetailsResponse } from "@/pages/details";
import type { ProductDetailsType, ProductType } from "@/type";
import { useNavigate } from "react-router-dom";
import { VariantCard } from "./variant";
import { useState } from "react";
import { Review } from "./review";
import { CartButton } from "../common/cart-button";
import { Skeleton } from "../common/skeleton";
import { getVariant } from "@/helper";
import { CheckoutButton } from "../common/checkout-button";
import { ImageGallery } from "../common/image-gallery";

interface Props {
    id: string;
    onShowModal?: (
        type: string,
        title?: string,
        size?: string,
        data?: unknown,
    ) => void;
}
interface DetailsModalResponse {
    data: ProductDetailsResponse | undefined;
    isLoading: boolean;
    error: unknown;
}
type StateType = string | null;

export const DetailsModal = ({ id, onShowModal }: Props) => {
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState<number>(1);
    const [displayPrice, setDisplayPrice] = useState<string>("৳0");
    const [selectedSize, setSelectedSize] = useState<StateType>(null);
    const [selectedColor, setSelectedColor] = useState<StateType>(null);
    const [selectedVariantImage, setSelectedVariantImage] =
        useState<StateType>(null);
    const { data, isLoading } = useGetProductDetails(
        id as string,
    ) as DetailsModalResponse;

    const [displayDiscountPrice, setDisplayDiscountPrice] =
        useState<string>("৳0");

    if (isLoading)
        return (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-3 bg-background">
                <Skeleton className="w-full h-[320px]" />
                <div className="space-y-1.5 md:space-y-2.5">
                    <Skeleton className="w-full h-8" />
                    <Skeleton className="w-full h-6" />
                    <Skeleton className="w-full h-5" />
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="w-full h-10" />
                </div>
            </div>
        );

    if (!data?.data?.[0]) navigate("/products");

    const product: ProductDetailsType = data?.data?.[0] as ProductDetailsType;

    return (
        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-3 bg-background">
            <ImageGallery
                product={product}
                className="max-h-[340px]"
                img={
                    selectedVariantImage
                        ? selectedVariantImage
                        : product?.thumbnail_image
                }
            />

            <div className="space-y-1.5 md:space-y-2.5">
                <h2 className="text-xl md:text-2xl font-bold">
                    {product?.name}
                </h2>

                <Review product={product} />

                <div className="flex items-center gap-3">
                    <span className="text-xl md:text-2xl font-bold">
                        {displayPrice}
                    </span>
                    <span className="text-xl md:text-xl text-muted-foreground line-through">
                        {displayDiscountPrice}
                    </span>
                </div>

                <VariantCard
                    product={product}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    selectedSize={selectedSize}
                    selectedColor={selectedColor}
                    setSelectedSize={setSelectedSize}
                    setSelectedColor={setSelectedColor}
                    setDisplayPrice={setDisplayPrice}
                    setDisplayDiscountPrice={setDisplayDiscountPrice}
                    onVariantImageChange={setSelectedVariantImage}
                />

                <div className="flex gap-2 flex-col">
                    <div className="flex-1">
                        <CartButton
                            product={product as unknown as ProductType}
                            quantity={quantity}
                            type="DETAILS"
                            variant={getVariant(
                                selectedColor,
                                selectedSize,
                                product?.variants,
                            )}
                            onShowModal={onShowModal}
                        />
                    </div>
                    <div className="flex-1">
                        <CheckoutButton
                            type="DETAILS"
                            product={product as unknown as ProductType}
                            quantity={quantity}
                            onShowModal={onShowModal}
                            variant={getVariant(
                                selectedColor,
                                selectedSize,
                                product?.variants,
                            )}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
