import { BaseLayout } from "@/components/layout/base-layout";
import { useSelector } from "react-redux";
import type { RootStateType } from "@/redux/store";
import { CartItem } from "./item";
import { CartSummary } from "@/components/card/summary";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomeSectionTitle } from "@/components/common/section-title";
import { Link } from "react-router-dom";
import { SeoWrapper } from "@/components/common/seo-wrapper";
import { EmptyCart } from "@/components/common/empty-cart";
import { useGtmTracker } from "@/hooks/useGtmTracker";
import { useEffect, useRef } from "react";
import { cartTotalPrice, cartTotalItems } from "@/helper";

export const CartPage = () => {
  const hasTracked = useRef(false);
  const { viewCartTracker } = useGtmTracker();
  const cart = useSelector((state: RootStateType) => state.cart);

  useEffect(() => {
    if (cart?.items?.length > 0 && !hasTracked.current) {
      viewCartTracker({
        value: cartTotalPrice(cart?.items || []),
        items: cartTotalItems(cart?.items || []),
      });
      hasTracked.current = true;
    }
  }, [cart, viewCartTracker]);

  return (
    <>
      <SeoWrapper title="My Cart" />
      <BaseLayout>
        <section className="mb-10 md:mb-20 mt-10">
          <HomeSectionTitle title="My Cart" />
          {cart?.items?.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 mx-4 md:mx-0 lg:grid-cols-3 gap-4 lg:gap-8">
              <div className="lg:col-span-2">
                <div className="space-y-3 lg:space-y-4">
                  {cart?.items?.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </div>

              <div className="lg:col-span-1">
                <CartSummary>
                  <Link to="/checkout">
                    <Button className="w-full" size="lg">
                      <CreditCard className="h-5 w-5 mr-2" />
                      CHECK OUT
                    </Button>
                  </Link>
                </CartSummary>
              </div>
            </div>
          )}
        </section>
      </BaseLayout>
    </>
  );
};
