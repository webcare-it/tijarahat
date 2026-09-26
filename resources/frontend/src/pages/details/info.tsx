import { useState } from "react";
import type { ProductDetailsType, ProductType } from "@/type";
import { CartButton } from "@/components/common/cart-button";
import { VariantCard } from "@/components/card/variant";
import { getVariant, slugify } from "@/helper";
import { FeatureCards } from "@/pages/details/feature";
import { CheckoutButton } from "@/components/common/checkout-button";
import { useModal } from "@/hooks/useModal";
import { ModalWrapper } from "@/components/common/modal-wrapper";
import { ProductSuccess } from "@/components/card/product";
import { OptimizedImage } from "@/components/common/optimized-image";
import { ShippingCostForDetails } from "../checkout/shipping";
import { SocialMessage } from "@/components/common/social-message";

interface Props {
    product: ProductDetailsType;
    onVariantImageChange?: (image: string) => void;
}

type StateType = string | null;

export const ProductInfo = ({ product, onVariantImageChange }: Props) => {
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedSize, setSelectedSize] = useState<StateType>(null);
    const [selectedColor, setSelectedColor] = useState<StateType>(null);
    const [displayPrice, setDisplayPrice] = useState<string>(
        product?.variants?.[0]?.variant_price_string ||
            `${product?.currency_symbol}${product?.calculable_price}` ||
            product?.main_price ||
            "৳00.00",
    );
    const [displayDiscountPrice, setDisplayDiscountPrice] = useState<string>(
        product?.variants?.[0]?.variant_price_without_discount ||
            product?.stroked_price ||
            "৳00.00",
    );

    const { modalRef, modalConfig, onHideModal, onShowModal } = useModal();
    const hasBrand = product?.brand?.name || product?.brand?.logo;

    const successProduct = { ...product, main_price: displayPrice };

    const title = `${window.location.origin}/products/${product?.id}/${slugify(product?.name)}`;

    return (
        <>
            <div className="space-y-1.5 md:space-y-4 md:col-span-6">
                <div>
                    <h1 className="text-xl md:text-2xl line-clamp-2 lg:text-3xl font-bold text-foreground leading-tight">
                        {product?.name}
                    </h1>
                    {/* <Review product={product} /> */}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl md:text-3xl font-bold text-foreground">
                            {displayPrice}
                        </span>
                        {product?.has_discount && (
                            <span className="text-xl md:text-2xl text-muted-foreground line-through">
                                {displayDiscountPrice}
                            </span>
                        )}
                    </div>
                </div>

                {hasBrand && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{"Brand"}:</span>
                        <div className="flex items-center gap-2">
                            {product?.brand?.logo ? (
                                <OptimizedImage
                                    src={product?.brand?.logo || ""}
                                    alt={product?.brand?.name}
                                    className="w-20 h-10 object-contain"
                                />
                            ) : (
                                <span className="text-sm font-medium">
                                    {product?.brand?.name}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                <VariantCard
                    product={product}
                    quantity={quantity}
                    selectedColor={selectedColor}
                    selectedSize={selectedSize}
                    setSelectedColor={setSelectedColor}
                    setSelectedSize={setSelectedSize}
                    setQuantity={setQuantity}
                    setDisplayPrice={setDisplayPrice}
                    onVariantImageChange={onVariantImageChange}
                    setDisplayDiscountPrice={setDisplayDiscountPrice}
                />

                <div className="grid grid-cols-2 gap-4 items-center">
                    <div className="col-span-1">
                        <CartButton
                            product={product as unknown as ProductType}
                            quantity={quantity}
                            type="DETAILS"
                            onShowModal={onShowModal}
                            variant={getVariant(
                                selectedColor,
                                selectedSize,
                                product?.variants,
                            )}
                        />
                    </div>
                    <div className="col-span-1">
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
                <SocialMessage title={title} />
                <p className="text-base text-gray-900 mt-2 md:mt-0 font-semibold text-center">
                    পণ্যের জন্য এক টাকাও অগ্রিম দিতে হবে না।
                </p>

                <FeatureCards />
                <ShippingCostForDetails />
            </div>
            <ModalWrapper
                ref={modalRef}
                title={modalConfig.title}
                width={modalConfig.size}
                onHide={onHideModal}
            >
                {modalConfig.type === "SUCCESS" && (
                    <ProductSuccess
                        product={successProduct as unknown as ProductType}
                        onHideModal={onHideModal}
                    />
                )}
            </ModalWrapper>
        </>
    );
};
