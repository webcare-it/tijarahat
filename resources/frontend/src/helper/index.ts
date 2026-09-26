import type { ConfigType } from "@/hooks/useConfig";
import type {
    ProductDetailsType,
    ProductType,
    StateSyncType,
    UserType,
    VariantType,
} from "@/type";
import { IMAGE_URL } from "../constant";

export const getImageUrl = (url: string) => {
    return `${IMAGE_URL}${url}`;
};

export const isExistingItem = (
    items: StateSyncType[],
    product: ProductType,
) => {
    const result = items?.find(
        (f: StateSyncType) =>
            (f?.productId === product?.productId ||
                f?.productId === product?.id) &&
            (f?.variant === product?.variant ||
                (!f?.variant && !product?.variant)),
    );
    return result;
};

export const getUUID = () => {
    return crypto.randomUUID();
};

export const setLocalStorage = (key: string, value: string) => {
    if (typeof window !== "undefined") {
        localStorage.setItem(key, value);
    }
};

export function formatProductType(value: string): string {
    if (!value) return "";
    return value
        ?.split("_")
        ?.map((word) => word.charAt(0).toUpperCase() + word?.slice(1))
        ?.join(" ");
}

export const getLocalStorage = (key: string) => {
    if (typeof window !== "undefined") {
        const value = localStorage.getItem(key);
        if (!value) return null;
        try {
            return JSON.parse(value);
        } catch {
            return null;
        }
    }
    return null;
};

export const removeLocalStorage = (key: string) => {
    if (typeof window !== "undefined") {
        localStorage.removeItem(key);
    }
};

export const slugify = (text: string): string => {
    if (!text || text === null || text === undefined) {
        return "";
    }

    const isBangla = (text: string): boolean => {
        const banglaRegex = /[\u0980-\u09FF]/;
        return banglaRegex.test(text);
    };

    const cleanText = text.replace(/['".,!?;:()[\]{}]/g, "").trim();
    const extraClean = cleanText.replace(/\//g, "");

    const words = extraClean.split(/\s+/).filter((word) => word.length > 0);

    if (isBangla(cleanText)) return words.join("-");

    return words.map((word) => word.toLowerCase()).join("-");
};

export const slugifyToTitle = (slug: string): string => {
    const isBangla = (text: string): boolean => {
        const banglaRegex = /[\u0980-\u09FF]/;
        return banglaRegex.test(text);
    };

    const words = slug.split("-").filter((word) => word.length > 0);

    if (words.length === 0) return "";

    if (isBangla(slug)) {
        return words
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    return words
        .map(
            (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");
};

export const getConfig = (config: ConfigType[] = [], key: string) => {
    if (!config || !key) return null;

    const result = config?.find((item) => item.type === key);
    return result;
};

export const getFormattedBanner = (
    banners: unknown | null,
    links: string[] | null,
) => {
    if (!Array.isArray(banners) || banners.length === 0) {
        return [];
    }

    const b = banners
        .map((item) => (typeof item === "string" ? item : ""))
        .filter((item) => item !== null && item !== undefined && item !== "");

    if (b.length === 0) {
        return [];
    }

    const result = b.map((banner, idx) => ({
        image: banner,
        link: links ? links[idx] || "" : "",
    }));

    return result;
};

export const htmlToPlainText = (html: string | null | undefined): string => {
    if (!html || html === null || html === undefined) {
        return "";
    }

    if (typeof window === "undefined" || typeof document === "undefined") {
        return html
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    try {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || "";
    } catch {
        return html;
    }
};

export const truncateText = (text: string, maxLength: number = 30): string => {
    if (!text || text === null || text === undefined) {
        return "";
    }

    if (text?.length <= maxLength) {
        return text;
    }

    return text.substring(0, maxLength) + "...";
};

export const getUserId = () => {
    if (typeof window !== "undefined") {
        const userId = localStorage.getItem("user_id");
        return userId;
    }
    return null;
};

export const getSelectedShippingMethod = () => {
    if (typeof window !== "undefined") {
        const result = localStorage.getItem("selected_shipping_method");
        return result || "";
    }
    return "";
};

export const getSelectedPaymentMethod = () => {
    if (typeof window !== "undefined") {
        const result = localStorage.getItem("selected_payment_method");
        return result || "";
    }
    return "";
};

export const keyToValue = (key: string): string => {
    if (!key || key === null || key === undefined) {
        return "";
    }
    return key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
        .trim();
};
export const isAuthenticated = () => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        return token;
    }
    return null;
};

export const getGuestUserId = () => {
    if (typeof window !== "undefined") {
        const guestUserId = localStorage.getItem("guest_user_id");
        return guestUserId;
    }
    return null;
};

export const extractNumericValue = (str: string): number => {
    if (!str || str === null || str === undefined) {
        return 0;
    }

    const numericString = str.replace(/[^\d.-]/g, "");

    if (!numericString || numericString === "" || numericString === "-") {
        return 0;
    }
    const numericValue = parseFloat(numericString);
    return isNaN(numericValue) ? 0 : numericValue;
};

const extractYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;

    url = url.trim();

    const patterns = [
        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
        /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /(?:m\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
};

export const getYouTubeEmbedUrl = (url: string): string | null => {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) return null;

    return `https://www.youtube.com/embed/${videoId}`;
};

export const getUniqueColors = (product: ProductDetailsType): string[] => {
    if (!product?.variants || product?.variants?.length === 0) return [];
    const colors = product?.variants
        ?.map((variant) => variant?.color_code)
        ?.filter((color) => color && color.trim() !== "");
    return [...new Set(colors)];
};
export const getUniqueColorName = (
    product: ProductDetailsType,
    c: string,
): string => {
    if (!product?.variants || product?.variants?.length === 0) return "";
    const colorVariant = product?.variants?.find((v) => v?.color_code === c);
    return colorVariant?.color_name || "";
};

export const getUniqueSizes = (product: ProductDetailsType): string[] => {
    if (!product?.variants || product?.variants?.length === 0) return [];
    const sizes = product?.variants
        ?.map((variant) => variant?.size_name)
        ?.filter((size) => size && size.trim() !== "");
    return [...new Set(sizes)];
};

export const findVariantByColorAndSize = (
    product: ProductDetailsType,
    color: string,
    size: string,
): VariantType | null => {
    if (!product?.variants || product?.variants?.length === 0) return null;
    if (!color || !size) return null;

    return (
        product?.variants?.find(
            (variant) =>
                variant?.color_code === color && variant?.size_name === size,
        ) || null
    );
};

export const getCurrentStock = (
    product: ProductDetailsType,
    selectedColor: string | null,
    selectedSize: string | null,
): { stock: number; unit: string } => {
    if (!product) {
        return { stock: 0, unit: "pieces" };
    }

    if (!product?.variants || product?.variants?.length === 0) {
        return {
            stock: product?.current_stock || 0,
            unit: product?.unit || "pieces",
        };
    }

    const cleanColor = selectedColor?.trim() || null;
    const cleanSize = selectedSize?.trim() || null;

    if (cleanColor && cleanSize) {
        const variant = findVariantByColorAndSize(
            product,
            cleanColor,
            cleanSize,
        );
        if (
            variant &&
            variant.variant_stock !== null &&
            variant.variant_stock !== undefined
        ) {
            return {
                stock: Math.max(0, variant?.variant_stock || 0),
                unit: product?.unit || "pieces",
            };
        }
    }

    if (cleanColor && !cleanSize) {
        const colorVariant = product?.variants?.find(
            (v) =>
                v.color_name === cleanColor &&
                v.variant_stock !== null &&
                v.variant_stock !== undefined,
        );
        if (colorVariant) {
            return {
                stock: Math.max(0, colorVariant?.variant_stock || 0),
                unit: product?.unit || "pieces",
            };
        }
    }

    if (cleanSize && !cleanColor) {
        const sizeVariant = product?.variants?.find(
            (v) =>
                v.size_name === cleanSize &&
                v.variant_stock !== null &&
                v.variant_stock !== undefined,
        );
        if (sizeVariant) {
            return {
                stock: Math.max(0, sizeVariant?.variant_stock || 0),
                unit: product?.unit || "pieces",
            };
        }
    }

    return {
        stock: Math.max(0, product?.current_stock || 0),
        unit: product?.unit || "pieces",
    };
};

export const removeCurrencySymbol = (price: string): number => {
    if (!price || price === null || price === undefined) {
        return 0;
    }
    const cleanedPrice = price.replace(/[^\d.-]/g, "");
    return parseFloat(cleanedPrice) || 0;
};

export const hasDiscount = (
    mainPrice: string,
    strokedPrice: string,
): number => {
    const originalPrice = removeCurrencySymbol(strokedPrice);
    const currentPrice = removeCurrencySymbol(mainPrice);

    if (originalPrice > currentPrice && originalPrice > 0) {
        const amountSaved = originalPrice - currentPrice;
        const percentage = Math.round((amountSaved / originalPrice) * 100);
        return percentage > 0 ? percentage : 0;
    }
    return 0;
};

type MergedType = string | null;
export const getVariant = (
    color: MergedType,
    size: MergedType,
    variants: VariantType[],
): MergedType => {
    const getColorName = (color: string, variants: VariantType[]) => {
        const colorVariant = variants?.find((v) => v?.color_code === color);
        return colorVariant?.color_name;
    };
    if (color && size) {
        const colorName = getColorName(color, variants);
        if (colorName) {
            return `${colorName}-${size}`;
        } else {
            return null;
        }
    } else if (color && !size) {
        const colorName = getColorName(color, variants);
        if (colorName) {
            return colorName;
        } else {
            return null;
        }
    } else if (!color && size) {
        return size;
    } else {
        return null;
    }
};

export const getProfileImage = (user: UserType) => {
    if (isAuthenticated()) {
        if (user?.provider_id === "google" && user?.avatar) {
            return user?.avatar;
        }
        return user?.avatar_original
            ? getImageUrl(user?.avatar_original as string)
            : undefined;
    }
    return undefined;
};

export const isPathActive = (
    currentPath: string,
    menuPath: string,
): boolean => {
    if (currentPath === menuPath) return true;

    if (
        menuPath.startsWith("/categories/") &&
        currentPath.startsWith(menuPath + "/")
    ) {
        return true;
    }

    if (
        menuPath.startsWith("/dashboard/") &&
        currentPath.startsWith(menuPath + "/")
    ) {
        return true;
    }

    return false;
};

export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const cartTotalPrice = (items: StateSyncType[]) => {
    return items?.reduce((acc, item) => acc + (item.mainPrice || 0), 0) || 0;
};

export const cartTotalItems = (items: StateSyncType[]) => {
    return (
        items?.map((item) => ({
            item_id: item?.id?.toString() || "",
            item_name: item?.name || "",
            item_price: item?.mainPrice || 0,
            item_category: item?.category_name || "",
            item_quantity: item?.quantity || 1,
        })) || []
    );
};

export const normalizeCategoryData = (data: unknown): unknown[] => {
    if (
        data &&
        typeof data === "object" &&
        "data" in data &&
        Array.isArray((data as { data: unknown[] }).data)
    ) {
        return (data as { data: unknown[] }).data;
    }

    if (Array.isArray(data)) {
        return data;
    }

    return [];
};
