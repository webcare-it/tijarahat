import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { LandingVariantCard } from "./variant";
import type { LandingPageType } from "./type";
import { getVariant } from "@/helper";
import type { ProductDetailsType, ProductType, StateSyncType } from "@/type";
import { useDispatch, useSelector } from "react-redux";
import type { RootStateType } from "@/redux/store";
import { useCampaignAddToCart } from "@/controllers/campaignController";
import { useGetCampaignCartQuery } from "@/api/queries/useGetCart";
import { setCartItemsCampaign } from "@/redux/slice/campaignSlice";
import { useGtmTracker, type PurchaseTrackerType } from "@/hooks/useGtmTracker";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { OptimizedImage } from "@/components/common/optimized-image";
import { Checkbox } from "@/components/ui/checkbox";
import { OrdersSection } from "./order";

interface Props {
    info: LandingPageType;
}
type StateType = string | null;

export const ProductSection = ({ info }: Props) => {
    const hasMounted = useRef(false);

    const campaign = useSelector(
        (state: RootStateType) => state.campaign?.items,
    );
    const { startCheckoutTracker } = useGtmTracker();
    const products = useMemo(
        () => info?.products?.data || [],
        [info?.products?.data],
    );
    const { ref, isIntersecting } = useIntersectionObserver({
        threshold: 0.1,
        rootMargin: "0px",
        triggerOnce: true,
    });

    useEffect(() => {
        if (
            isIntersecting &&
            products?.length > 0 &&
            !hasMounted.current &&
            campaign?.length > 0
        ) {
            hasMounted.current = true;

            const trackerData: PurchaseTrackerType = {
                transaction_id: Math.random().toString(36).substring(2, 15),
                value: products?.[0]?.calculable_price || 0,
                customer_type: "new",
                items: [
                    {
                        item_id: String(products?.[0]?.id || ""),
                        item_name: products?.[0]?.name || "",
                        item_price: products?.[0]?.calculable_price || 0,
                        item_quantity: 1,
                        item_category: products?.[0]?.category_name || "",
                        item_variant:
                            products?.[0]?.variants?.[0]?.size_name &&
                            products?.[0]?.variants?.[0]?.color_name
                                ? `${products?.[0]?.variants?.[0]?.size_name} - ${products?.[0]?.variants?.[0]?.color_name}`
                                : products?.[0]?.variants?.[0]?.size_name ||
                                  products?.[0]?.variants?.[0]?.color_name ||
                                  "",
                    },
                ],
            };

            startCheckoutTracker(trackerData);
        }
    }, [isIntersecting, products, startCheckoutTracker, campaign]);

    return (
        <section id="order-section" ref={ref} className="w-full mx-auto">
            {products?.length > 0 ? (
                <div className="w-full n">
                    {/* Form Banner Header */}
                    <div className="bg-primary text-primary-foreground text-center py-5 px-2 md:px-6 rounded-t-lg">
                        <h2 className="text-xl md:text-2xl font-bold mb-1">
                            Order Form
                        </h2>
                        <p className="text-sm md:text-base">
                            Please select the products you want to order and
                            fill in your shipping information.
                        </p>
                    </div>

                    <div className="bg-white">
                        <div className="divide-y divide-gray-200 border border-gray-200 rounded-t-0 rounded-b-md overflow-hidden">
                            {products?.map((product, index) => (
                                <SingleProduct
                                    key={product.id}
                                    product={product}
                                    isFirstProduct={index === 0}
                                    isSectionVisible={isIntersecting}
                                />
                            ))}
                        </div>
                    </div>
                    <OrdersSection />
                </div>
            ) : null}
        </section>
    );
};

const SingleProduct = ({
    product,
    isFirstProduct = false,
    isSectionVisible = false,
}: {
    product: ProductDetailsType;
    isFirstProduct?: boolean;
    isSectionVisible?: boolean;
}) => {
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState<number>(1);
    const [displayPrice, setDisplayPrice] = useState<string>("0");
    const [selectedSize, setSelectedSize] = useState<StateType>(null);
    const [selectedColor, setSelectedColor] = useState<StateType>(null);
    const autoAddedRef = useRef(false);
    const campaign = useSelector(
        (state: RootStateType) => state.campaign?.items,
    );
    const { data, isLoading: isCartLoading } = useGetCampaignCartQuery();

    // Auto-select first variant on mount
    useEffect(() => {
        if (product?.variants && product.variants.length > 0) {
            const firstVariant = product.variants[0];
            if (firstVariant?.size_name) {
                setSelectedSize(firstVariant.size_name);
            }
            if (firstVariant?.color_name) {
                setSelectedColor(firstVariant.color_name);
            }
        }
    }, [product?.variants, product?.id]);

    useEffect(() => {
        if (!isCartLoading) {
            if (data && data?.length > 0 && data?.[0]?.cart_items?.length > 0) {
                const cart = data?.[0]?.cart_items?.map((item) => {
                    const result: StateSyncType = {
                        id: item?.id,
                        productId: item?.product_id,
                        name: item?.product_name,
                        category_name: item?.category_name,
                        image: item?.product_thumbnail_image,
                        mainPrice: item?.price,
                        showPrice: `${item?.currency_symbol} ${item?.price}`,
                        variant: item?.variation,
                        quantity: item?.quantity,
                    };
                    return result;
                });

                dispatch(setCartItemsCampaign(cart as StateSyncType[]));
            } else {
                dispatch(setCartItemsCampaign([]));
            }
        }
    }, [data, isCartLoading, dispatch]);

    const isInCart = campaign?.find((item) => item.productId === product.id);

    const { isLoading, fnAddToCart } = useCampaignAddToCart(
        product as unknown as ProductType,
        quantity,
        getVariant(selectedColor, selectedSize, product?.variants),
    );

    // Auto-add first product when section becomes visible and not already in cart
    useEffect(() => {
        if (
            isFirstProduct &&
            isSectionVisible &&
            !autoAddedRef.current &&
            !isInCart &&
            !isLoading
        ) {
            autoAddedRef.current = true;
            const timer = setTimeout(() => {
                fnAddToCart();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isFirstProduct, isSectionVisible, isInCart, isLoading, fnAddToCart]);

    const handleIncrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        setQuantity((prev) => prev + 1);
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    return (
        <div
            onClick={() => fnAddToCart()}
            key={product?.id}
            className={cn(
                "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-2 md:p-4 transition-all duration-200 cursor-pointer select-none",
                isLoading && "opacity-75 cursor-not-allowed",
                isInCart ? "bg-amber-50/40" : "bg-white hover:bg-gray-50/50",
            )}
        >
            <div className="flex items-center gap-2 md:gap-4 flex-1 w-full sm:w-auto">
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center"
                >
                    <Checkbox
                        className="h-5 w-5 border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary cursor-pointer"
                        checked={!!isInCart}
                        onCheckedChange={() => fnAddToCart()}
                    />
                </div>

                <div className="relative size-14 md:size-16 overflow-hidden rounded border border-gray-200 flex-shrink-0 bg-gray-50">
                    <OptimizedImage
                        src={product?.thumbnail_image || ""}
                        alt={product?.name}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-sm md:text-base font-bold text-gray-900 line-clamp-2 leading-snug">
                        {product?.name}
                    </h3>

                    <LandingVariantCard
                        product={product}
                        quantity={quantity}
                        setQuantity={setQuantity}
                        selectedSize={selectedSize}
                        selectedColor={selectedColor}
                        setSelectedSize={setSelectedSize}
                        setSelectedColor={setSelectedColor}
                        setDisplayPrice={setDisplayPrice}
                    />
                </div>
            </div>

            {/* Right Box: Quantity Controls Counter & Appended Dynamic Prices */}
            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center border border-gray-300 rounded-md bg-white overflow-hidden h-8"
                >
                    <button
                        onClick={handleDecrement}
                        className="px-3 h-full text-gray-500 hover:bg-gray-100 transition-colors text-base font-medium cursor-pointer"
                    >
                        -
                    </button>
                    <span className="px-3 min-w-[2.5rem] text-center text-sm font-semibold text-gray-800">
                        {quantity}
                    </span>
                    <button
                        onClick={handleIncrement}
                        className="px-3 h-full text-gray-500 hover:bg-gray-100 transition-colors text-base font-medium cursor-pointer"
                    >
                        +
                    </button>
                </div>

                <div className="text-right flex-shrink-0">
                    <span className="text-base md:text-lg font-bold text-gray-900 whitespace-nowrap">
                        {displayPrice}
                    </span>
                </div>
            </div>
        </div>
    );
};
