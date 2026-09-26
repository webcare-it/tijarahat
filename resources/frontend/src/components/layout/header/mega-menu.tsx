import { useState, useRef, useEffect } from "react";
import { useMenuData } from "./useMenu";
import { Link, useLocation } from "react-router-dom";
import { Image, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { isPathActive } from "@/helper";
import { Skeleton } from "@/components/common/skeleton";
import { OptimizedImage } from "@/components/common/optimized-image";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<"li"> & {
  href: string;
  highlight?: boolean;
  onClick?: () => void;
};

const MegaMenuListItem = ({
  title,
  href,
  highlight = false,
  onClick,
  ...props
}: Props) => {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link
          to={href}
          onClick={onClick}
          className={`text-sm hover:underline hover:text-primary block ${
            highlight ? "text-primary font-semibold" : "text-muted-foreground"
          }`}>
          {title}
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

export const MegaMenu = () => {
  const location = useLocation();
  const pathname = location?.pathname;
  const { menuData, isLoading } = useMenuData();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  const closeMenu = () => {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      activeElement.blur();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      checkScrollPosition();
    }, 100);

    const handleResize = () => {
      setTimeout(() => checkScrollPosition(), 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [menuData]);

  if (isLoading) {
    return (
      <nav className="relative border border-border">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 justify-center py-1">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="w-36 h-8 rounded" />
            ))}
          </div>
        </div>
      </nav>
    );
  }

  return (
    menuData?.length > 0 && (
      <nav className="sticky top-14 md:top-16 z-60 bg-background shadow-sm">
        <div className="md:w-[768px] lg:w-[1024px] xl:w-[1280px] 2xl:w-[1536px] mx-auto relative">
          <div className="flex justify-center">
            <AnimatePresence>
              {canScrollLeft && (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  onClick={scrollLeft}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-primary/20 rounded-full p-2 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 cursor-pointer"
                  aria-label="Scroll left">
                  <ChevronLeft className="w-4 h-4 text-primary" />
                </motion.button>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {canScrollRight && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  onClick={scrollRight}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-primary/20 rounded-full p-2 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 cursor-pointer"
                  aria-label="Scroll right">
                  <ChevronRight className="w-4 h-4 text-primary" />
                </motion.button>
              )}
            </AnimatePresence>

            <NavigationMenu
              className={cn(
                "md:w-[768px] lg:w-[1024px] xl:w-[1280px] 2xl:w-[1536px]"
              )}>
              <div className="relative w-full overflow-x-hidden">
                <div
                  ref={scrollContainerRef}
                  onScroll={checkScrollPosition}
                  className="scrollbar-hide overflow-x-hidden pr-12">
                  <NavigationMenuList className="flex items-center py-0.5 justify-start">
                    {menuData
                      ?.filter((item) => item && item?.name)
                      ?.map((item, index) => {
                        if (!item || !item?.name) {
                          return null;
                        }

                        return (
                          <NavigationMenuItem
                            key={item?.name || `item-${index}`}
                            className="text-nowrap flex-shrink-0">
                            {item?.submenu ? (
                              <>
                                <NavigationMenuTrigger
                                  className={`font-medium hover:text-primary transition-colors hover:underline cursor-pointer text-muted-foreground ${
                                    isPathActive(pathname, item?.href)
                                      ? "text-primary"
                                      : "text-muted-foreground"
                                  }`}>
                                  <Link
                                    to={item?.href}
                                    className="w-full h-full">
                                    {item?.name}
                                  </Link>
                                </NavigationMenuTrigger>

                                <NavigationMenuContent>
                                  <div className="bg-background rounded md:w-[768px] lg:w-[1024px] xl:w-[1280px] 2xl:w-[1536px] mx-auto max-h-[600px] overflow-y-auto overflow-x-auto">
                                    <div className="flex gap-6 p-5 w-full overflow-x-auto">
                                      {item?.submenu?.columns?.map(
                                        (column, idx) => (
                                          <div
                                            key={idx}
                                            className="flex-1 min-w-[180px]">
                                            <Link
                                              to={column?.href}
                                              className={`font-bold mb-4 line-clamp-1 hover:underline hover:text-primary ${
                                                isPathActive(
                                                  pathname,
                                                  column?.href
                                                )
                                                  ? "text-primary"
                                                  : "text-muted-foreground"
                                              }`}>
                                              {column?.title}
                                            </Link>
                                            <ul className="space-y-2">
                                              {column?.links?.map(
                                                (link, linkIdx) => (
                                                  <MegaMenuListItem
                                                    key={linkIdx}
                                                    title={link?.name}
                                                    href={link?.href}
                                                    highlight={isPathActive(
                                                      pathname,
                                                      link?.href
                                                    )}
                                                    onClick={closeMenu}
                                                  />
                                                )
                                              )}
                                            </ul>
                                          </div>
                                        )
                                      )}
                                      {item?.submenu?.promos && (
                                        <div className="w-80 flex-shrink-0 space-y-4">
                                          {item?.submenu?.promos?.map(
                                            (promo, idx) => (
                                              <Link
                                                key={idx}
                                                to={promo?.link}
                                                onClick={closeMenu}
                                                className="block group">
                                                <div className="w-80 h-48 object-cover relative overflow-hidden rounded-lg">
                                                  {promo?.image ? (
                                                    <OptimizedImage
                                                      src={promo?.image}
                                                      alt={promo?.title}
                                                      className="absolute top-0 left-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                                                    />
                                                  ) : (
                                                    <div className="absolute w-full h-full bg-gray-200 animate-pulse">
                                                      <Image className="w-full h-full object-cover" />
                                                    </div>
                                                  )}
                                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                                    <p className="text-white font-semibold line-clamp-1">
                                                      {promo?.title}
                                                    </p>
                                                  </div>
                                                </div>
                                              </Link>
                                            )
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </NavigationMenuContent>
                              </>
                            ) : (
                              <NavigationMenuLink
                                asChild
                                className={navigationMenuTriggerStyle()}>
                                <Link
                                  to={item?.href as string}
                                  onClick={closeMenu}
                                  className={`font-medium hover:text-primary transition-colors hover:underline cursor-pointer ${
                                    isPathActive(pathname, item?.href)
                                      ? "text-primary"
                                      : "text-muted-foreground"
                                  }`}>
                                  {item?.name || `Category ${index + 1}`}
                                </Link>
                              </NavigationMenuLink>
                            )}
                          </NavigationMenuItem>
                        );
                      })}
                  </NavigationMenuList>
                </div>
              </div>
            </NavigationMenu>
          </div>
        </div>
      </nav>
    )
  );
};
