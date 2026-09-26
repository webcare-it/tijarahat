import { CheckCircle } from "lucide-react";
import type { ProductType } from "@/type";
import { Skeleton } from "../common/skeleton";
import { slugify } from "@/helper";
import { Link } from "react-router";
import { CartButton } from "../common/cart-button";
import { WishlistButton } from "../common/wishlist-button";
import { DetailsModal } from "./details-modal";
import { useModal } from "@/hooks/useModal";
import { ModalWrapper } from "../common/modal-wrapper";
import { Discount } from "../common/discount";
import { CheckoutButton } from "../common/checkout-button";
import { OptimizedImage } from "../common/optimized-image";
import { Button } from "../ui/button";

interface Props {
    product: ProductType;
    badge?: string;
}

export const ProductCard = ({ product, badge = "" }: Props) => {
    const { modalRef, modalConfig, onHideModal, onShowModal } = useModal();

    return (
        <>
            <div className="group relative mt-2 md:mt-0 overflow-hidden rounded-lg border bg-card transition-all hover:scale-105 cursor-pointer duration-300 select-none">
                <WishlistButton product={product} size="DEFAULT" />
                <Discount product={product} type="CARD" badge={badge} />

                <Link to={`/products/${product?.id}/${slugify(product?.name)}`}>
                    <div className="relative aspect-[16/17] overflow-hidden bg-muted">
                        <OptimizedImage
                            src={product?.thumbnail_image || ""}
                            alt={product?.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                </Link>

                <div className="p-1.5 sm:p-2 group-hover:bg-primary/5">
                    <Link
                        to={`/products/${product?.id}/${slugify(product?.name)}`}
                    >
                        {product?.in_stock ? (
                            <span className="text-xs font-medium text-green-600 bg-green-100 rounded px-2 py-0.5">
                                In stock
                            </span>
                        ) : (
                            <span className="text-xs font-medium text-red-600 bg-red-100 rounded px-2 py-0.5">
                                Out of stock
                            </span>
                        )}
                        {/* <Review product={product} starSize="w-3 h-3" /> */}
                        <h3 className="line-clamp-1 mt-0.5 text-xs md:text-sm font-medium leading-tight text-foreground duration-300">
                            {product?.name}
                        </h3>

                        <div className="mb-1 flex items-center gap-2 duration-300">
                            <span className="text-base md:text-lg font-bold text-foreground">
                                {product?.main_price}
                            </span>
                            {product?.has_discount && (
                                <span className="text-sm text-muted-foreground line-through">
                                    {product?.stroked_price}
                                </span>
                            )}
                        </div>
                    </Link>

                    <div className="flex items-center gap-1.5 md:gap-2 -mb-0.5 duration-300">
                        <div className="flex-1 w-full">
                            <CartButton
                                product={product}
                                type="SLIDER"
                                onShowModal={onShowModal}
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <CheckoutButton
                                type="SLIDER"
                                onShowModal={onShowModal}
                                product={product as ProductType}
                                quantity={1}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <ModalWrapper
                ref={modalRef}
                title={modalConfig.title}
                width={modalConfig.size}
                onHide={onHideModal}
            >
                {modalConfig.type === "DETAILS" && (
                    <DetailsModal
                        id={product?.id as unknown as string}
                        onShowModal={onShowModal}
                    />
                )}
                {modalConfig.type === "SUCCESS" && (
                    <ProductSuccess
                        product={product}
                        onHideModal={onHideModal}
                    />
                )}
            </ModalWrapper>
        </>
    );
};

interface ProductSuccessProps {
    product: ProductType;
    onHideModal: () => void;
}

export const ProductSuccess = ({
    product,
    onHideModal,
}: ProductSuccessProps) => {
    return (
        <div className="w-full flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex items-start justify-center gap-2">
                <div className="size-16 relative overflow-hidden rounded-lg bg-cover bg-center border border-border">
                    <OptimizedImage
                        src={product?.thumbnail_image || ""}
                        alt={product?.name}
                        className="w-full h-full object-cover relative"
                    />
                </div>

                <div>
                    <p className="text-sm font-medium text-foreground line-clamp-1">
                        {product?.name}
                    </p>
                    <p className="text-base font-semibold text-foreground">
                        {"Price"}: {product?.main_price}
                    </p>
                </div>
            </div>

            <div className="w-full flex items-center justify-center gap-2">
                <div className="flex-1 w-full">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={onHideModal}
                    >
                        {"Back to shopping"}
                    </Button>
                </div>
                <div className="flex-1 w-full">
                    <Link to="/checkout">
                        <Button
                            variant="default"
                            className="w-full"
                            onClick={onHideModal}
                        >
                            Order now
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export const ProductCardSkeleton = () => {
    return (
        <div className="group relative mt-2 md:mt-0 overflow-hidden rounded-lg border bg-card transition-all hover:scale-105 cursor-pointer duration-300 select-none">
            <div className="absolute right-1 top-1 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm">
                <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <div className="absolute left-1 top-1 z-10">
                <Skeleton className="h-5 w-14 rounded-full" />
            </div>

            <div className="relative aspect-[16/17] overflow-hidden bg-muted">
                <Skeleton className="h-full w-full" />
            </div>

            <div className="p-1.5 sm:p-2">
                {/* <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-4 w-4" />
                        ))}
                    </div>
                    <Skeleton className="h-3 w-8" />
                </div> */}

                <Skeleton className="h-4 w-full my-1" />

                <div className="mb-1 flex items-center gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-4 w-12" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="flex-1 h-7" />
                    <Skeleton className="flex-1 h-7" />
                </div>
            </div>
        </div>
    );
};
