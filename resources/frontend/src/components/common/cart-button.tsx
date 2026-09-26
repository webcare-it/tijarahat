import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import type { ProductType, StateSyncType } from "@/type";
import { useAddToCart, useRemoveFromCart } from "@/controllers/cartController";
import { Spinner } from "../ui/spinner";
import { cn } from "@/lib/utils";
import { useRemoveFromWishlist } from "@/controllers/wishlistController";
import toast from "react-hot-toast";

interface Props {
    product: ProductType;
    quantity?: number;
    type: "CARD" | "DETAILS" | "MOVE_TO_CART" | "SLIDER";
    productId?: string | number;
    variant?: string | null;
    onShowModal?: (
        type: string,
        title?: string,
        size?: string,
        data?: unknown,
    ) => void;
    onHideModal?: () => void;
    isShowToast?: boolean;
}

export const CartButton = ({
    product,
    quantity = 1,
    type = "CARD",
    variant = null,
    onShowModal,
    onHideModal,
    productId,
}: Props) => {
    const { isLoading, fnAddToCart } = useAddToCart(
        product,
        quantity,
        variant,
        productId,
        onShowModal,
    );
    const { removeLoading, fnRemoveWishlist } = useRemoveFromWishlist(product);
    const style = {
        CARD: {
            size: "xs",
            variant: "default",
            icon: <ShoppingCart className="h-2 w-2" />,
        },
        DETAILS: {
            size: "lg",
            variant: "default",
            icon: <ShoppingCart className="w-4 h-4 mr-2" />,
        },
    } as const;

    const handleMoveToCart = async () => {
        await fnAddToCart();
        await fnRemoveWishlist();
    };

    if (type === "MOVE_TO_CART") {
        return (
            <Button
                onClick={handleMoveToCart}
                disabled={removeLoading || isLoading}
                className={cn(
                    "w-full text-xs",
                    isLoading || removeLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "",
                )}
                size="xs"
            >
                <ShoppingCart className="h-4 w-4 md:mr-2" />
                <span className="hidden md:block">{"Move to Cart"}</span>
            </Button>
        );
    }

    if (type === "SLIDER") {
        return (
            <Button
                className="w-full"
                size="xs"
                variant="default"
                onClick={() => {
                    if (!product?.in_stock) toast.error("Out of stock");
                    if (product?.variant_product == 1) {
                        if (onShowModal) {
                            onShowModal(
                                "DETAILS",
                                product?.name,
                                "max-w-4xl",
                                product?.id,
                            );
                        }
                    } else {
                        fnAddToCart();
                        if (onHideModal) {
                            onHideModal();
                        }
                    }
                }}
                disabled={isLoading || !product?.in_stock}
            >
                {isLoading ? (
                    <Spinner />
                ) : (
                    <>
                        <ShoppingCart className="h-4 w-4 hidden md:block" />
                        <span className="text-xs font-medium">Add to cart</span>
                    </>
                )}
            </Button>
        );
    }

    return (
        <Button
            className="w-full"
            size={style[type].size}
            variant={style[type].variant}
            onClick={() => {
                if (product?.variant_product == 1) {
                    if (onShowModal) {
                        onShowModal(
                            "DETAILS",
                            product?.name,
                            "max-w-4xl",
                            product?.id,
                        );
                    }
                } else {
                    fnAddToCart();
                    if (onHideModal) {
                        onHideModal();
                    }
                }
            }}
            disabled={isLoading || !product?.in_stock}
        >
            {isLoading ? (
                <>
                    <Spinner /> {"Processing..."}
                </>
            ) : (
                <>
                    {style[type].icon}
                    {"Add to cart"}
                </>
            )}
        </Button>
    );
};

interface PropsRemove {
    item: StateSyncType;
    type: "CART_DESKTOP" | "CART_MOBILE" | "CHECKOUT";
}

export const RemoveCartButton = ({ item, type }: PropsRemove) => {
    const { removeLoading, fnRemoveCart } = useRemoveFromCart(item);
    if (type === "CART_DESKTOP") {
        return (
            <Button
                variant="ghost"
                size="sm"
                onClick={fnRemoveCart}
                disabled={removeLoading}
                className="text-muted-foreground hover:text-red-600 hover:bg-red-50 p-2"
            >
                <Trash2 className="h-4 w-4 mr-1" />
                {"Remove"}
            </Button>
        );
    }
    if (type === "CART_MOBILE") {
        return (
            <Button
                variant="ghost"
                size="sm"
                onClick={fnRemoveCart}
                disabled={removeLoading}
                className="text-muted-foreground hover:text-red-600 hover:bg-red-50 p-1"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        );
    }
    if (type === "CHECKOUT") {
        return (
            <Button
                onClick={fnRemoveCart}
                disabled={removeLoading}
                variant="ghost"
                size="sm"
            >
                <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
        );
    }
    return null;
};
