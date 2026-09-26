import { useSelector } from "react-redux";
import type { RootStateType } from "@/redux/store";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "@/components/common/wishlist-button";
import { CartButton } from "@/components/common/cart-button";
import { slugify } from "@/helper";
import type { ProductType } from "@/type";
import { OptimizedImage } from "@/components/common/optimized-image";

export const WishlistItems = () => {
  const wishlist = useSelector((state: RootStateType) => state.wishlist);
  return (
    <>
      {wishlist?.items?.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="mx-auto h-16 w-16 text-primary mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-muted-foreground mb-6">
            Save items you love for later by adding them to your wishlist.
          </p>
          <Button asChild>
            <Link to="/products">Start Shopping→</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-4 md:mx-0">
          {wishlist?.items?.map((item) => (
            <Card key={item.id} className="p-1 md:p-4 border rounded-lg">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-20 h-16 relative rounded-lg border overflow-hidden">
                  <OptimizedImage
                    src={item?.image || ""}
                    alt={item?.name}
                    className="absolute w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      className="flex-1"
                      to={`/products/${item?.productId}/${slugify(
                        item?.name
                      )}`}>
                      <h3 className="text-sm md:text-base font-normal md:font-medium text-foreground line-clamp-1">
                        {item?.name}
                      </h3>

                      {item?.variant && (
                        <Badge variant="secondary" className="mb-2 text-xs">
                          {item?.variant}
                        </Badge>
                      )}

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-base md:text-lg font-bold text-foreground">
                          {item?.showPrice}
                        </span>
                      </div>
                    </Link>
                    <div className="flex flex-col gap-1 md:gap-3">
                      <WishlistButton
                        product={item as unknown as ProductType}
                        size="WISHLIST-BUTTON"
                      />
                      <CartButton
                        product={item as unknown as ProductType}
                        quantity={1}
                        variant={item?.variant}
                        type="MOVE_TO_CART"
                        productId={item?.productId}
                        isShowToast={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};
