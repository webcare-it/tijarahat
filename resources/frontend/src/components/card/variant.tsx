import { useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    findVariantByColorAndSize,
    getCurrentStock,
    getUniqueColors,
    getUniqueSizes,
} from "@/helper";
import { StockVisibilityStateEnum, type ProductDetailsType } from "@/type";

interface Props {
    quantity: number;
    product: ProductDetailsType;
    selectedColor: string | null;
    selectedSize: string | null;
    setSelectedColor: React.Dispatch<React.SetStateAction<string | null>>;
    setSelectedSize: React.Dispatch<React.SetStateAction<string | null>>;
    setQuantity: (quantity: number) => void;
    setDisplayPrice: (price: string) => void;
    setDisplayDiscountPrice: (price: string) => void;
    onVariantImageChange?: (image: string) => void;
}

export const VariantCard = ({
    quantity,
    product,
    selectedColor,
    selectedSize,
    setSelectedColor,
    setSelectedSize,
    setQuantity,
    setDisplayPrice,
    onVariantImageChange,
    setDisplayDiscountPrice,
}: Props) => {
    const handleQuantityChange = (newQuantity: number): void => {
        const currentStock = getCurrentStock(
            product,
            selectedColor,
            selectedSize,
        );
        if (newQuantity >= 1 && newQuantity <= currentStock?.stock) {
            setQuantity(newQuantity);
        }
    };

    const handleColorSelect = (color: string): void => {
        if (!color || color.trim() === "") return;

        setSelectedColor(color);

        if (selectedSize) {
            const variant = findVariantByColorAndSize(
                product,
                color,
                selectedSize,
            );
            if (variant) {
                setDisplayPrice(variant?.variant_price_string);
                onVariantImageChange?.(variant?.variant_image);
            }
        } else {
            const colorVariant = product?.variants?.find(
                (v) => v?.color_code === color,
            );
            if (colorVariant) {
                setDisplayPrice(colorVariant?.variant_price_string);
                onVariantImageChange?.(colorVariant?.variant_image);
            }
        }
    };

    const handleSizeSelect = (size: string): void => {
        if (!size || size.trim() === "") return;

        setSelectedSize(size);

        if (selectedColor) {
            const variant = findVariantByColorAndSize(
                product,
                selectedColor,
                size,
            );
            if (variant) {
                setDisplayPrice(variant?.variant_price_string);
                setDisplayDiscountPrice(
                    variant?.variant_price_without_discount,
                );
                onVariantImageChange?.(variant?.variant_image);
            }
        } else {
            const sizeVariant = product?.variants?.find(
                (v) => v.size_name === size,
            );
            if (sizeVariant) {
                setDisplayPrice(sizeVariant?.variant_price_string);
                setDisplayDiscountPrice(
                    sizeVariant?.variant_price_without_discount,
                );
                onVariantImageChange?.(sizeVariant?.variant_image);
            }
        }
    };

    useEffect(() => {
        if (product?.variants && product?.variants?.length > 0) {
            const firstVariant = product?.variants[0];
            setSelectedColor(firstVariant?.color_code);
            setSelectedSize(firstVariant?.size_name);
            setDisplayPrice(firstVariant?.variant_price_string);
            onVariantImageChange?.(firstVariant?.variant_image);
            setDisplayDiscountPrice(
                firstVariant?.variant_price_without_discount,
            );
        } else {
            setDisplayPrice(product?.main_price);
            setDisplayDiscountPrice(product?.stroked_price);
        }
    }, [
        product,
        onVariantImageChange,
        setDisplayPrice,
        setSelectedColor,
        setSelectedSize,
        setDisplayDiscountPrice,
    ]);

    useEffect(() => {
        const currentStock = getCurrentStock(
            product,
            selectedColor,
            selectedSize,
        );
        if (quantity > currentStock?.stock && currentStock?.stock > 0) {
            setQuantity(currentStock?.stock);
        } else if (currentStock?.stock === 0) {
            setQuantity(product?.min_qty || 1);
        }
    }, [selectedColor, selectedSize, product, quantity, setQuantity]);

    return (
        <>
            {product?.variants &&
                product?.variants?.length > 0 &&
                getUniqueColors(product).length > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Colors:</span>
                        <div className="flex items-center flex-wrap gap-2">
                            {getUniqueColors(product)?.map((color) => {
                                return (
                                    <button
                                        key={color}
                                        onClick={() => handleColorSelect(color)}
                                        className={cn(
                                            "rounded-full cursor-pointer flex items-center justify-center transition-all duration-200 border-3",
                                            selectedColor === color
                                                ? "border-primary"
                                                : "border-transparent",
                                        )}
                                        aria-label={`Select ${color} color`}
                                    >
                                        <div
                                            className="w-5 h-5 md:w-6 md:h-6 m-1 rounded-full flex items-center justify-center"
                                            style={{
                                                backgroundColor: color,
                                            }}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

            {product?.variants &&
                product?.variants?.length > 0 &&
                getUniqueSizes(product)?.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">Size:</span>
                        <div className="flex items-center flex-wrap gap-2">
                            {getUniqueSizes(product)?.map((size) => (
                                <Button
                                    key={size}
                                    variant={
                                        selectedSize === size
                                            ? "default"
                                            : "outline"
                                    }
                                    onClick={() => handleSizeSelect(size)}
                                    className={cn(
                                        "flex items-center justify-center transition-all",
                                        selectedSize === size
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:border-primary/50",
                                    )}
                                    aria-label={`Select ${size} size`}
                                >
                                    <span className="text-sm">{size}</span>
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

            {product?.stock_visibility_state !==
            StockVisibilityStateEnum.HIDE ? (
                <div className="flex items-center gap-2">
                    {(() => {
                        const getStockText = () => {
                            const currentStock = getCurrentStock(
                                product,
                                selectedColor,
                                selectedSize,
                            );
                            const isOutOfStock = currentStock?.stock === 0;
                            if (isOutOfStock) {
                                return "Out of stock";
                            }
                            if (
                                product?.stock_visibility_state ===
                                StockVisibilityStateEnum.TEXT
                            ) {
                                return "In stock";
                            }
                            return `${currentStock?.stock} ${currentStock?.unit}`;
                        };

                        return (
                            <div className="flex items-center gap-2">
                                <div
                                    className={cn(
                                        "w-3 h-3 rounded-full",
                                        getStockText() === "Out of stock"
                                            ? "bg-red-500"
                                            : "bg-green-500",
                                    )}
                                />
                                <span
                                    className={cn(
                                        "text-xs md:text-sm font-medium",
                                        getStockText() === "Out of stock" &&
                                            "text-red-600",
                                        getStockText() !== "Out of stock" &&
                                            "text-green-600",
                                    )}
                                >
                                    {getStockText()}
                                </span>
                            </div>
                        );
                    })()}
                </div>
            ) : null}

            <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center gap-3 my-1 md:my-0">
                    {(() => {
                        const currentStock = getCurrentStock(
                            product,
                            selectedColor,
                            selectedSize,
                        );
                        return (
                            <>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                        handleQuantityChange(quantity - 1)
                                    }
                                    disabled={(function x() {
                                        if (quantity > product?.min_qty)
                                            return false;
                                        if (quantity <= 1) return false;
                                        return true;
                                    })()}
                                    aria-label="Decrease quantity"
                                >
                                    <Minus className="w-4 h-4" />
                                </Button>

                                <span className="w-12 text-foreground text-center text-xs md:text-sm font-medium select-none">
                                    {quantity}
                                </span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                        handleQuantityChange(quantity + 1)
                                    }
                                    disabled={quantity >= currentStock.stock}
                                    aria-label="Increase quantity"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </>
                        );
                    })()}
                </div>
            </div>
        </>
    );
};
