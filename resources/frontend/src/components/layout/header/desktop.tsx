import { Heart, ShoppingCart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ActionSearchBar } from "./search";
import { UserProfile } from "./user";
import { useSelector } from "react-redux";
import type { RootStateType } from "@/redux/store";
import { MegaMenu } from "./mega-menu";
import { Logo } from "./logo";
import { useMemo } from "react";

export const HeaderDesktop = ({
    isShowMegaMenu,
}: {
    isShowMegaMenu: boolean;
}) => {
    const pathname = useLocation();
    const cart = useSelector((state: RootStateType) => state.cart);
    const wishlist = useSelector((state: RootStateType) => state.wishlist);

    const searchBar = useMemo(() => {
        return <ActionSearchBar />;
    }, []);

    const megaMenu = useMemo(() => {
        return <MegaMenu />;
    }, []);

    return (
        <nav className="hidden md:block bg-background text-foreground">
            <div className="h-14 md:flex items-center justify-center w-full px-1 md:px-6 border-b">
                <div className="container flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 justify-start">
                        <Logo type="DESKTOP" />
                    </div>

                    <div className="flex flex-1 justify-center items-center">
                        {searchBar}
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        {/* Track Order */}
                        <Link to="/track-order" title="Track Order">
                            <Button
                                variant={
                                    pathname.pathname === "/track-order"
                                        ? "ghost"
                                        : "outline"
                                }
                                className={
                                    pathname.pathname === "/track-order"
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                                        : "border-border bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground"
                                }
                            >
                                Track Order
                            </Button>
                        </Link>

                        {/* Wishlist */}
                        <Link to="/wishlist" title="Wishlist">
                            <Button
                                variant={
                                    pathname.pathname === "/wishlist"
                                        ? "ghost"
                                        : "outline"
                                }
                                size="icon-lg"
                                className={
                                    pathname.pathname === "/wishlist"
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                                        : "border-border bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground"
                                }
                            >
                                <div title="Wishlist" className="relative">
                                    <Heart
                                        strokeWidth={2.5}
                                        absoluteStrokeWidth
                                    />

                                    {wishlist?.items?.length > 0 && (
                                        <span className="absolute -top-2.5 -right-2.5 bg-primary text-primary-foreground rounded-full text-[10px] font-medium w-4 h-4 flex items-center justify-center">
                                            {wishlist?.items?.length}
                                        </span>
                                    )}
                                </div>

                                <span className="sr-only">Wishlist</span>
                            </Button>
                        </Link>

                        {/* Cart */}
                        <Link to="/cart">
                            <Button
                                variant={
                                    pathname.pathname === "/cart"
                                        ? "ghost"
                                        : "outline"
                                }
                                size="icon-lg"
                                className={
                                    pathname.pathname === "/cart"
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                                        : "border-border bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground"
                                }
                            >
                                <div title="Shopping Cart" className="relative">
                                    <ShoppingCart
                                        strokeWidth={2.5}
                                        absoluteStrokeWidth
                                    />

                                    {cart?.items?.length > 0 && (
                                        <span className="absolute -top-2.5 -right-2.5 bg-primary text-primary-foreground rounded-full text-[10px] font-medium w-4 h-4 flex items-center justify-center">
                                            {cart?.items?.length}
                                        </span>
                                    )}
                                </div>

                                <span className="sr-only">Shopping Cart</span>
                            </Button>
                        </Link>

                        <UserProfile />
                    </div>
                </div>
            </div>

            {isShowMegaMenu && megaMenu}
        </nav>
    );
};
