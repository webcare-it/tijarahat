import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus } from "lucide-react";
import type { ProductType, StateSyncType } from "@/type";
import { slugify } from "@/helper";
import { WishlistButton } from "@/components/common/wishlist-button";
import {
  useRemoveFromCart,
  useIncrementCart,
  useDecrementCart,
} from "@/controllers/cartController";
import { Link } from "react-router-dom";
import { RemoveCartButton } from "@/components/common/cart-button";
import { Quantity } from "@/components/card/quantity";
import { OptimizedImage } from "@/components/common/optimized-image";

interface Props {
  item: StateSyncType;
}

export const CartItem = ({ item }: Props) => {
  const { fnRemoveCart } = useRemoveFromCart(item);
  const { isLoading: inLoading, fnIncrementCart } = useIncrementCart(item);
  const { isLoading: deLoading, fnDecrementCart } = useDecrementCart(item);

  const handleIncrement = () => {
    fnIncrementCart();
  };

  const handleDecrement = () => {
    fnDecrementCart();
  };

  return (
    <Card className="p-1 md:p-3 border transition-shadow rounded-md md:rounded-lg">
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-20 h-16 sm:w-24 sm:h-20 relative rounded-lg border overflow-hidden">
          <OptimizedImage
            src={item?.image || ""}
            alt={item?.name}
            className="absolute w-full h-full object-cover"
          />

          <WishlistButton
            product={item as unknown as ProductType}
            size="CART-BUTTON-SMALL"
            onRemove={fnRemoveCart}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="block sm:hidden">
            <div className="flex justify-between items-center md:items-start md:mb-2">
              <div className="flex-1">
                <Link
                  to={`/products/${item?.productId}/${slugify(item?.name)}`}>
                  <h3 className="text-base hover:underline font-semibold text-foreground line-clamp-1">
                    {item?.name}
                  </h3>
                </Link>
                {item?.variant && (
                  <Badge variant="secondary" className="mb-1 text-xs">
                    {item?.variant}
                  </Badge>
                )}
              </div>
              <RemoveCartButton item={item} type="CART_MOBILE" />
            </div>

            <div className="flex justify-between items-center">
              <div className="text-lg font-bold text-foreground">
                {item?.mainPrice}
              </div>
              <Quantity item={item} />
            </div>
          </div>

          <div className="hidden sm:block">
            <div className="flex gap-2 justify-between items-start">
              <div className="flex-1">
                <Link
                  to={`/products/${item?.productId}/${slugify(item?.name)}`}>
                  <h3 className="text-lg hover:underline font-semibold text-foreground mb-1 line-clamp-1">
                    {item?.name}
                  </h3>
                </Link>

                {item?.variant && (
                  <Badge variant="secondary" className="mb-2 text-xs">
                    {item?.variant}
                  </Badge>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    In Stock
                  </span>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDecrement()}
                    disabled={item?.quantity <= 1 || deLoading}
                    className="h-8 w-8 p-0 border border-border hover:bg-gray-50">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium text-foreground">
                    {item?.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleIncrement()}
                    disabled={inLoading}
                    className="h-8 w-8 p-0 border border-border hover:bg-gray-50">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-foreground">
                    {item?.showPrice}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-4">
                <WishlistButton
                  size="CART-BUTTON-LARGE"
                  product={item as unknown as ProductType}
                  onRemove={fnRemoveCart}
                />
                <RemoveCartButton item={item} type="CART_DESKTOP" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
