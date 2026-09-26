import type { ProductDetailsType, ProductType } from "@/type";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import {
    findVariantByColorAndSize,
    getCurrentStock,
    getUniqueColorName,
    getUniqueColors,
    getUniqueSizes,
    getVariant,
} from "@/helper";
import { useCampaignAddToCart } from "@/controllers/campaignController";

interface Props {
    quantity: number;
    product: ProductDetailsType;
    selectedColor: string | null;
    selectedSize: string | null;
    setSelectedColor: React.Dispatch<React.SetStateAction<string | null>>;
    setSelectedSize: React.Dispatch<React.SetStateAction<string | null>>;
    setQuantity: (quantity: number) => void;
    setDisplayPrice: (price: string) => void;
    onVariantImageChange?: (image: string) => void;
}

export const LandingVariantCard = ({
    product,
    quantity,
    setQuantity,
    selectedColor,
    selectedSize,
    setSelectedColor,
    setSelectedSize,
    setDisplayPrice,
}: Props) => {
    const { isLoading, fnAddToCart } = useCampaignAddToCart(
        product as unknown as ProductType,
        quantity,
    );

    const handleColorSelect = (color: string, e: React.MouseEvent): void => {
        e.stopPropagation();
        if (!color || color.trim() === "") return;
        setSelectedColor((prev: string | null) =>
            prev !== color ? color : prev,
        );

        const variant = getVariant(color, selectedSize, product?.variants);
        if (selectedSize) {
            const variant = findVariantByColorAndSize(
                product,
                color,
                selectedSize,
            );
            if (variant) setDisplayPrice(variant?.variant_price_string);
        } else {
            const colorVariant = product?.variants?.find(
                (v) => v?.color_code === color,
            );
            if (colorVariant)
                setDisplayPrice(colorVariant?.variant_price_string);
        }
        fnAddToCart(variant as string | undefined);
    };

    const handleSizeSelect = (size: string, e: React.MouseEvent): void => {
        e.stopPropagation();
        if (!size || size.trim() === "") return;
        setSelectedSize((prev: string | null) => (prev !== size ? size : prev));

        if (selectedColor) {
            const variant = findVariantByColorAndSize(
                product,
                selectedColor,
                size,
            );
            if (variant) setDisplayPrice(variant?.variant_price_string);
        } else {
            const sizeVariant = product?.variants?.find(
                (v) => v.size_name === size,
            );
            if (sizeVariant) setDisplayPrice(sizeVariant?.variant_price_string);
        }
        const variant = getVariant(selectedColor, size, product?.variants);
        fnAddToCart(variant as string | undefined);
    };

    useEffect(() => {
        if (product?.variants && product?.variants?.length > 0) {
            const firstVariant = product?.variants[0];
            setSelectedColor(firstVariant?.color_code);
            setSelectedSize(firstVariant?.size_name);
            setDisplayPrice(firstVariant?.variant_price_string);
        } else {
            setDisplayPrice(
                `${product?.currency_symbol}${product?.calculable_price}` ||
                    product?.main_price ||
                    "৳0",
            );
        }
    }, [product, setDisplayPrice, setSelectedColor, setSelectedSize]);

    useEffect(() => {
        const currentStock = getCurrentStock(
            product,
            selectedColor,
            selectedSize,
        );
        if (quantity > currentStock?.stock && currentStock?.stock > 0) {
            setQuantity(currentStock?.stock);
        } else if (currentStock?.stock === 0) {
            setQuantity(0);
        }
    }, [selectedColor, selectedSize, product, quantity, setQuantity]);

    return (
        <div
            className="flex flex-col gap-1 mt-1 text-xs text-gray-500"
            onClick={(e) => e.stopPropagation()}
        >
            {product?.variants &&
                product?.variants?.length > 0 &&
                getUniqueColors(product).length > 0 && (
                    <div className="flex items-center gap-1.5">
                        <span>Colors:</span>
                        <div className="flex items-center gap-1 flex-wrap">
                            {getUniqueColors(product)?.map((color) => (
                                <button
                                    key={color}
                                    disabled={isLoading}
                                    onClick={(e) => handleColorSelect(color, e)}
                                    className={cn(
                                        "rounded py-0.5 px-1 border-[1px] transition-all flex items-center gap-2 cursor-pointer",
                                        selectedColor === color
                                            ? "border-primary scale-105"
                                            : "border-gray-300",
                                    )}
                                >
                                    <div
                                        className="size-3 rounded-full"
                                        style={{ backgroundColor: color }}
                                    />

                                    <span className="text-[10px] font-medium text-gray-800">
                                        {getUniqueColorName(product, color)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

            {product?.variants &&
                product?.variants?.length > 0 &&
                getUniqueSizes(product)?.length > 0 && (
                    <div className="flex items-center gap-1.5">
                        <span>Sizes:</span>
                        <div className="flex items-center flex-wrap gap-1">
                            {getUniqueSizes(product)?.map((size) => (
                                <button
                                    key={size}
                                    disabled={isLoading}
                                    onClick={(e) => handleSizeSelect(size, e)}
                                    className={cn(
                                        "px-1.5 py-0.5 text-[11px] font-medium border rounded transition-all",
                                        selectedSize === size
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-400",
                                    )}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

            {(() => {
                const currentStock = getCurrentStock(
                    product,
                    selectedColor,
                    selectedSize,
                );
                if (!currentStock || currentStock.stock === 0) {
                    return (
                        <span className="text-red-500 text-[11px] font-medium">
                            Out of stock
                        </span>
                    );
                }
                return null;
            })()}
        </div>
    );
};
