import { ClipboardCheck } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import type { ProductDetailsType, ProductType } from "@/type";
import { useAddToCart } from "@/controllers/cartController";
import { Spinner } from "../ui/spinner";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface Props {
    product: ProductType | ProductDetailsType;
    type: "CARD" | "DETAILS" | "SLIDER";
    onShowModal?: (
        type: string,
        title?: string,
        size?: string,
        data?: unknown,
    ) => void;
    quantity?: number;
    variant?: string | null;
}

export const CheckoutButton = ({
    product,
    type,
    onShowModal,
    quantity = 1,
    variant = null,
}: Props) => {
    const { isLoading, fnAddToCart } = useAddToCart(
        product as ProductType,
        quantity,
        variant,
        product?.id,
        onShowModal,
    );

    const handleCheckout = () => {
        if (!product?.in_stock) {
            toast.error("Product is out of stock");
            return;
        }
        if (
            "variant_product" in product &&
            product.variant_product == 1 &&
            onShowModal
        ) {
            onShowModal("DETAILS", product?.name, "max-w-4xl", product?.id);

            return;
        } else {
            if (type === "DETAILS") {
                fnAddToCart(true);
                return;
            } else {
                fnAddToCart();
                return;
            }
        }
    };

    const style = {
        CARD: {
            size: "xs",
            variant: "outline",
            icon: <ClipboardCheck className="h-2 w-2" />,
        },
        DETAILS: {
            size: "lg",
            variant: "outline",
            icon: <ClipboardCheck className="h-4 w-4" />,
        },
    };

    if (type === "SLIDER") {
        return (
            <Button
                onClick={handleCheckout}
                disabled={isLoading || !product?.in_stock}
                className={cn(
                    "w-full border border-primary text-primary bg-white",
                )}
                size="xs"
                variant="outline"
            >
                {isLoading ? (
                    <Spinner />
                ) : (
                    <>
                        <ClipboardCheck className="h-4 w-4 hidden md:block text-primary" />
                        <span className="text-primary text-xs font-medium">
                            Order now
                        </span>
                    </>
                )}
            </Button>
        );
    }

    return (
        <Button
            onClick={handleCheckout}
            disabled={isLoading || !product?.in_stock}
            className="w-full border border-primary text-primary"
            size={
                style[type].size as VariantProps<typeof buttonVariants>["size"]
            }
            variant={
                style[type].variant as VariantProps<
                    typeof buttonVariants
                >["variant"]
            }
        >
            {isLoading ? (
                <>
                    <Spinner />
                    <span>Processing...</span>
                </>
            ) : (
                <>
                    {style[type].icon}
                    {"Order now"}
                </>
            )}
        </Button>
    );
};
