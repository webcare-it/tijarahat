import {
    Home,
    LayoutGrid,
    Handbag,
    type LucideIcon,
    Heart,
    Search,
    ArrowLeft,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootStateType } from "@/redux/store";
import { cn } from "@/lib/utils";
import { UserProfile } from "./user";
import { Logo } from "./logo";
import { ActionSearchBar } from "./search";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isPathActive } from "@/helper";

export const HeaderMobile = () => {
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [triggerAnimation, setTriggerAnimation] = useState(false);

    const handleSearchClick = () => {
        setIsSearchOpen(true);
        setTriggerAnimation(true);
    };

    const handleBackClick = () => {
        setIsSearchOpen(false);
        setTriggerAnimation(true);
    };

    const searchBar = useMemo(() => {
        return (
            <div className="flex-1">
                <ActionSearchBar ref={searchInputRef} />
            </div>
        );
    }, []);

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 300);
        }
    }, [isSearchOpen]);

    useEffect(() => {
        if (triggerAnimation) {
            const timer = setTimeout(() => {
                setTriggerAnimation(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [triggerAnimation]);

    return (
        <>
            <nav
                className={`md:hidden py-1 bg-background text-foreground backdrop-blur-3xl sticky top-0 left-0 right-0 z-[60] border-b border-border`}
            >
                {triggerAnimation ? (
                    <AnimatePresence mode="wait">
                        {!isSearchOpen ? (
                            <motion.div
                                key="logo-section"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeInOut",
                                }}
                                className="flex items-center justify-between px-4"
                            >
                                <div>
                                    <Logo type="MOBILE" />
                                </div>

                                <div className="flex justify-end items-center gap-2">
                                    {/* Search */}
                                    <button
                                        onClick={handleSearchClick}
                                        className="p-2.5 border border-border bg-transparent text-foreground rounded-lg transition-colors hover:bg-primary hover:text-primary-foreground"
                                    >
                                        <Search
                                            size={36}
                                            strokeWidth={2.5}
                                            className="h-5 w-5"
                                        />
                                    </button>

                                    {/* Track Order */}
                                    <Link
                                        to="/track-order"
                                        className="p-2.5 border border-border bg-transparent text-foreground rounded-lg transition-colors hover:bg-primary hover:text-primary-foreground"
                                    >
                                        <TrackIcon height="20px" width="30px" />
                                    </Link>

                                    {/* User */}
                                    <UserProfile />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="search-section"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeInOut",
                                }}
                                className="flex items-center justify-between px-4 gap-2 py-1"
                            >
                                <ArrowLeft
                                    onClick={handleBackClick}
                                    className="h-6 w-6 text-foreground"
                                />

                                {searchBar}
                            </motion.div>
                        )}
                    </AnimatePresence>
                ) : !isSearchOpen ? (
                    <div className="flex items-center justify-between px-4">
                        <div>
                            <Logo type="MOBILE" />
                        </div>

                        <div className="flex justify-end items-center gap-2">
                            {/* Search */}
                            <button
                                onClick={handleSearchClick}
                                className="p-2.5 border border-border bg-transparent text-foreground rounded-lg transition-colors hover:bg-primary hover:text-primary-foreground"
                            >
                                <Search
                                    size={36}
                                    strokeWidth={2.5}
                                    className="h-5 w-5"
                                />
                            </button>

                            {/* Track Order */}
                            <Link
                                to="/track-order"
                                className="p-2.5 border border-border bg-transparent text-foreground rounded-lg transition-colors hover:bg-primary hover:text-primary-foreground"
                            >
                                <TrackIcon height="20px" width="30px" />
                            </Link>

                            {/* User */}
                            <UserProfile />
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-between px-4 gap-2 py-1">
                        <ArrowLeft
                            onClick={handleBackClick}
                            className="h-6 w-6 text-foreground"
                        />

                        {searchBar}
                    </div>
                )}
            </nav>
        </>
    );
};

export const FooterMobile = () => {
    const location = useLocation();

    const cart = useSelector((state: RootStateType) => state.cart.items);
    const wishlist = useSelector(
        (state: RootStateType) => state.wishlist.items,
    );
    const itemCount = cart?.length ?? 0;
    const hasItems = itemCount > 0;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 w-full">
            <nav className="bg-white border-t border-border">
                <div className="flex justify-around items-center py-1.5">
                    <MenuItem
                        activePath={location.pathname}
                        href="/"
                        icon={Home}
                    >
                        {"Home"}
                    </MenuItem>
                    <Link
                        to="/categories"
                        className="flex flex-col items-center justify-center min-w-0 flex-1"
                    >
                        <LayoutGrid
                            className={cn(
                                "h-5 w-5 mb-1",
                                location.pathname.startsWith("/categories")
                                    ? "text-primary"
                                    : "text-foreground",
                            )}
                        />
                        <span
                            className={cn(
                                "text-[10px] font-medium",
                                location.pathname.startsWith("/categories")
                                    ? "text-primary"
                                    : "text-foreground",
                            )}
                        >
                            {"Categories"}
                        </span>
                    </Link>
                    <Link
                        to="/cart"
                        className="flex flex-col items-center justify-center min-w-0 flex-1 relative"
                    >
                        <motion.div
                            animate={
                                hasItems
                                    ? {
                                          scale: [1, 1.12, 1],
                                      }
                                    : { scale: 1 }
                            }
                            transition={
                                hasItems
                                    ? {
                                          duration: 1.2,
                                          repeat: Infinity,
                                          repeatType: "reverse",
                                          ease: "easeInOut",
                                      }
                                    : {}
                            }
                            className="bg-primary border-2 border-white rounded-full p-2 -mt-8 mb-1"
                        >
                            <Handbag className="h-8 w-8 text-white" />
                        </motion.div>

                        <span
                            className={`text-[10px] text-foreground font-medium ${
                                isPathActive(location.pathname, "/cart")
                                    ? "text-primary"
                                    : "text-foreground"
                            }`}
                        >
                            Cart ({itemCount})
                        </span>
                    </Link>
                    <Link
                        to={"/wishlist"}
                        className="relative flex flex-col items-center justify-center min-w-0 flex-1"
                    >
                        {wishlist?.length > 0 && (
                            <div className="absolute -top-2 right-3 bg-primary text-white rounded-full text-[10px] font-medium w-4 h-4 flex items-center justify-center">
                                <span> {wishlist?.length}</span>
                            </div>
                        )}
                        <Heart
                            className={cn(
                                "h-5 w-5 mb-1",
                                isPathActive(location.pathname, "/wishlist")
                                    ? "text-primary"
                                    : "text-foreground",
                            )}
                        />
                        <span
                            className={`text-[10px] text-foreground font-medium ${
                                isPathActive(location.pathname, "/wishlist")
                                    ? "text-primary"
                                    : "text-foreground"
                            }`}
                        >
                            {"Wishlist"}
                        </span>
                    </Link>
                    <div className="flex flex-col items-center justify-center min-w-0 flex-1">
                        <UserProfile variant="mobile" />
                    </div>
                </div>
            </nav>
        </div>
    );
};

interface MenuItemProps {
    children: React.ReactNode;
    href: string;
    activePath: string;
    icon: LucideIcon;
}

const MenuItem = ({
    children,
    href,
    icon: Icon,
    activePath,
}: MenuItemProps) => {
    const isActive = isPathActive(activePath, href);
    return (
        <Link
            to={href}
            className="flex flex-col items-center justify-center min-w-0 flex-1"
        >
            {Icon && (
                <Icon
                    className={cn(
                        "h-5 w-5 mb-1",
                        isActive ? "text-primary" : "text-foreground",
                    )}
                />
            )}
            <span
                className={cn(
                    "text-[10px] font-medium",
                    isActive ? "text-primary" : "text-foreground",
                )}
            >
                {children}
            </span>
        </Link>
    );
};

export const TrackIcon = ({
    height,
    width,
}: {
    height: string;
    width: string;
}) => {
    return (
        <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 640 512"
            height={height}
            width={width}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M0 48C0 21.5 21.5 0 48 0L368 0c26.5 0 48 21.5 48 48l0 48 50.7 0c17 0 33.3 6.7 45.3 18.7L589.3 192c12 12 18.7 28.3 18.7 45.3l0 18.7 0 32 0 64c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0c0 53-43 96-96 96s-96-43-96-96l-128 0c0 53-43 96-96 96s-96-43-96-96l-16 0c-26.5 0-48-21.5-48-48L0 48zM416 256l128 0 0-18.7L466.7 160 416 160l0 96zM160 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm368-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM257 95c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l39 39L96 168c-13.3 0-24 10.7-24 24s10.7 24 24 24l166.1 0-39 39c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l80-80c9.4-9.4 9.4-24.6 0-33.9L257 95z"></path>
        </svg>
    );
};
