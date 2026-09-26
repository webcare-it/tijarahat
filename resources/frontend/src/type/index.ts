export interface UserType {
    id: number;
    referred_by: number | null;
    provider_id: string | null;
    user_type: string;
    name: string;
    email: string | null;
    email_verified_at: string | null;
    verification_code: string | null;
    new_email_verificiation_code: string | null;
    device_token: string | null;
    avatar: string | null;
    avatar_original: string | null;
    address: string | null;
    country: string | null;
    state: string | null;
    city: string | null;
    postal_code: string | null;
    phone: string | null;
    balance: number;
    banned: number;
    referral_code: string | null;
    customer_package_id: number | null;
    remaining_uploads: number;
    created_at: string;
    updated_at: string;
}

export interface ProductType {
    id: number;
    name: string;
    productId?: string | number;
    category_name: string;
    thumbnail_image: string;
    has_discount: boolean;
    stroked_price: string;
    discount_price: number | string | null;
    calculable_price: number;
    main_price: string;
    in_stock: boolean;
    rating: number;
    rating_count: number;
    variant_product: number;
    variant?: string | null;
    quantity?: number | null;
    links: {
        details: string;
    };
}

export interface HomePropsType {
    isLoading: boolean;
    products: ProductType[] | [];
}

export interface HomeBannerPropsType {
    isLoading: boolean;
    items: { image: string | null; link: string | null }[] | [];
    isShowTitle?: boolean;
}
export interface CategoryProductType extends ProductType {
    category_name: string;
}

export interface VariantType {
    variant_name: string;
    color_name: string;
    color_code: string;
    size_name: string;
    variant_price: number;
    variant_price_string: string;
    variant_price_without_discount: string;
    variant_stock: number;
    variant_image: string;
}

export enum StockVisibilityStateEnum {
    TEXT = "text",
    QUANTITY = "quantity",
    HIDE = "hide",
}
export interface ProductDetailsType {
    id: number;
    name: string;
    added_by: string;
    category_name: string;
    seller_id: number;
    shop_id: number;
    in_stock: boolean;
    review: number;
    shop_name: string;
    min_qty: number;
    shop_logo: string;
    photos: {
        variant: string;
        path: string;
    }[];
    thumbnail_image: string;
    stock_visibility_state: StockVisibilityStateEnum;
    tags: string[];
    price_high_low: string;
    choice_options: {
        name: string;
        title: string;
        options: string[];
    }[];
    colors: string[];
    has_discount: boolean;
    stroked_price: string;
    main_price: string;
    discount_price: number | string | null;
    calculable_price: number;
    currency_symbol: string;
    current_stock: number;
    unit: string;
    rating: number;
    rating_count: number;
    earn_point: number;
    description: string;
    video_provider: string;
    video_link: string;
    brand: {
        id: number;
        name: string;
        logo: string;
    };
    link: string;
    pdf: string | null;
    variants: VariantType[];
}

export interface StateSyncType {
    id: string | number;
    productId: string | number;
    name: string;
    image: string;
    mainPrice: number;
    showPrice: number | string;
    variant?: string | null;
    category_name?: string | null;
    quantity: number;
}

export interface CategoryType {
    id: number;
    name: string;
    banner: string;
    icon: string;
    number_of_children: number;
    links: {
        products: string;
        sub_categories: string;
    };
}

export interface ShippingType {
    id: number;
    name: string;
    amount: number;
    status: number;
    created_at: string;
    updated_at: string;
}

export interface OrderType {
    id: number;
    code: string;
    user_id: number;
    payment_type: string;
    payment_status: string;
    payment_status_string: string;
    delivery_status: string;
    delivery_status_string: string;
    grand_total: string;
    date: string;
    links: {
        details: string;
    };
}

export interface InvoiceType {
    order_code: string;
    order_date: string;
    order_status: string;
    payment_method: string;

    subtotal: number;
    customer_type: "new" | "returning";
    shipping_cost: number;
    tax: number;
    coupon_discount: number;
    grand_total: number;
    coupon: string;
    shipping_address: {
        name: string | null;
        email: string | null;
        phone: string | null;
        address: string | null;
        city: string | null;
        postal_code: string | null;
        country: string | null;
    };
    user: {
        name: string;
        email: string;
        phone: string;
    };
    order_items: {
        product_id: number;
        product_name: string;
        product_thumbnail_image: string;
        variation?: string | null;
        quantity: number;
        delivery_type: string;
        price: number;
        category_name: string;
        shipping_cost: number;
        subtotal: number;
    }[];
}

export interface BrandType {
    id: number;
    name: string;
    logo: string;
    links: {
        products: string;
    };
}

export interface FilterPropsType {
    filters: Record<string, unknown>;
    setFilters: (filters: Record<string, unknown>) => void;
}

export interface FlashDealType {
    id: number;
    title: string;
    date: number;
    banner: string;
}
