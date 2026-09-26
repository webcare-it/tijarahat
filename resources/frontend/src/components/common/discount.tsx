import type { ProductDetailsType, ProductType } from "@/type";
import { Badge } from "../ui/badge";
import { hasDiscount } from "@/helper";

interface Props {
    type: "CARD" | "DETAILS" | "INFO";
    badge?: string;
    product: ProductType | ProductDetailsType;
}

export const Discount = ({ product, type, badge }: Props) => {
    const discount = hasDiscount(product?.main_price, product?.stroked_price);

    if (type === "INFO" && product?.has_discount) {
        return (
            <p className="text-sm text-green-600 font-medium">
                You save {discount}%
            </p>
        );
    }

    if (product?.has_discount) {
        return (
            <Badge
                className={`${
                    type === "DETAILS" ? "text-sm font-semibold" : ""
                } z-10 top-1 left-1 absolute text-white -mb-0.5`}
                variant="destructive"
            >
                DISCOUNT
            </Badge>
        );
    }

    if (badge) {
        const info = getBadgeAndColor(badge);

        return (
            <Badge
                className={`${
                    type === "DETAILS" ? "text-sm font-semibold" : ""
                } z-10 top-1 left-1 absolute text-white -mb-0.5 ${info?.style}`}
            >
                {info?.badge}
            </Badge>
        );
    }

    return null;
};

type BadgeInfo = {
    style: string;
    badge: string;
};

function getBadgeAndColor(type: string): BadgeInfo {
    const obj: Record<string, BadgeInfo> = {
        best_selling: {
            style: "bg-red-600",
            badge: "HOT",
        },
        new_arrivals: {
            style: "bg-green-600",
            badge: "NEW",
        },
        todays_deal: {
            style: "bg-amber-600",
            badge: "DEAL",
        },
        featured: {
            style: "bg-blue-600",
            badge: "FEATURED",
        },
    };

    return obj[type];
}
