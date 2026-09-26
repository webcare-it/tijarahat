import { Heart, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    useAddToWishlist,
    useRemoveFromWishlist,
} from "@/controllers/wishlistController";
import type { ProductType, StateSyncType } from "@/type";
import { useSelector } from "react-redux";
import type { RootStateType } from "@/redux/store";
import { isAuthenticated, isExistingItem } from "@/helper";
import { Button } from "../ui/button";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { TooltipWrapper } from "./tooltip-wrapper";

interface Props {
    product: ProductType;
    size:
        | "CART-BUTTON-SMALL"
        | "CART-BUTTON-LARGE"
        | "DEFAULT"
        | "WISHLIST-BUTTON";
    onRemove?: () => void;
}

export const WishlistButton = ({
    product,
    size = "DEFAULT",
    onRemove,
}: Props) => {
    const navigate = useNavigate();
    const { addLoading, fnAddToWishlist } = useAddToWishlist(product);
    const { removeLoading, fnRemoveWishlist } = useRemoveFromWishlist(
        product as unknown as StateSyncType,
    );

    const wishlist = useSelector((state: RootStateType) => state.wishlist);
    const isWishListed = isExistingItem(wishlist?.items, product);

    const handleCartButton = () => {
        if (isWishListed) {
            fnRemoveWishlist();
            return;
        } else {
            if (!isAuthenticated()) {
                toast.error("Please login to add to wishlist");
                navigate("/signin");
                return;
            } else {
                fnAddToWishlist();
                if (onRemove) {
                    onRemove();
                }
            }
        }
    };

    if (size === "CART-BUTTON-SMALL") {
        return (
            <button
                onClick={handleCartButton}
                disabled={addLoading || removeLoading}
                className={`md:hidden absolute left-0.5 top-0.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-accent backdrop-blur-sm transition-all hover:bg-background hover:scale-110 cursor-pointer ${
                    addLoading || removeLoading
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                }`}
            >
                <Heart
                    className={cn(
                        "h-3 w-3 transition-all",
                        isWishListed
                            ? "fill-red-500 text-red-500"
                            : "text-muted-foreground hover:text-red-500",
                    )}
                />
            </button>
        );
    }

    if (size === "CART-BUTTON-LARGE") {
        return (
            <Button
                variant="ghost"
                size="sm"
                onClick={handleCartButton}
                disabled={addLoading || removeLoading}
                className={cn(
                    "text-muted-foreground hover:text-red-600 hover:bg-red-50 p-2",
                    isWishListed
                        ? "text-red-500 hover:text-red-500 hover:bg-red-50"
                        : "text-muted-foreground hover:text-red-600",
                )}
            >
                <Heart
                    className={cn(
                        "h-4 w-4 mr-1 transition-all hover:text-red-600",
                        isWishListed
                            ? "fill-red-500 text-red-500"
                            : "text-muted-foreground hover:text-red-600",
                    )}
                />
                Save for later
            </Button>
        );
    }

    if (size === "WISHLIST-BUTTON") {
        return (
            <Button
                variant="outline"
                size="xs"
                onClick={fnRemoveWishlist}
                disabled={removeLoading}
                className={cn(
                    "text-red-600 hover:text-red-700 hover:bg-red-50 w-full text-xs",
                    removeLoading ? "opacity-50 cursor-not-allowed" : "",
                )}
            >
                <Trash2 className="h-4 w-4 md:mr-2" />
                <span className="hidden md:block">"Remove"</span>
            </Button>
        );
    }

    return (
        <TooltipWrapper text={"Sign in to add to your wishlist"}>
            <button
                onClick={isWishListed ? fnRemoveWishlist : fnAddToWishlist}
                disabled={addLoading || removeLoading}
                className={`absolute right-1 top-1 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-accent backdrop-blur-sm transition-all hover:bg-background hover:scale-110 cursor-pointer ${
                    addLoading || removeLoading
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                }`}
                aria-label="Add to wishlist"
                title="Add to wishlist"
            >
                <Heart
                    className={cn(
                        "h-4 w-4 transition-all",
                        isWishListed
                            ? "fill-red-500 text-red-500"
                            : "text-muted-foreground hover:text-red-500",
                    )}
                />
            </button>
        </TooltipWrapper>
    );
};
