import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import type { ProductDetailsType, ProductType } from "@/type";

interface Props {
  starSize?: string;
  product: ProductDetailsType | ProductType;
}

export const Review = ({ product, starSize = "w-4 h-4" }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
          const rating = product?.rating || 0;
          const isFullStar = i < Math.floor(rating);
          const isHalfStar = i === Math.floor(rating) && rating % 1 >= 0.5;

          return (
            <div key={i} className="relative">
              <Star className={cn(starSize, "text-muted-foreground")} />
              {isFullStar && (
                <Star
                  className={cn(
                    starSize,
                    "absolute top-0 left-0 fill-yellow-500 text-yellow-500"
                  )}
                />
              )}
              {isHalfStar && (
                <div
                  className="absolute top-0 left-0 overflow-hidden"
                  style={{ width: "50%" }}>
                  <Star
                    className={cn(starSize, "fill-yellow-500 text-yellow-500")}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <span className="text-sm text-muted-foreground">
        ({product?.rating_count || 0} {"reviews"})
      </span>
    </div>
  );
};
