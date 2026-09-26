import { FooterMobile } from "./header/mobile";
import { HeaderDesktop } from "./header/desktop";
import { HeaderMobile } from "./header/mobile";
import { getConfig } from "@/helper";
import { useConfig } from "@/hooks/useConfig";
import { useGetWishlist } from "@/controllers/wishlistController";
import { useGetCart } from "@/controllers/cartController";
import { SocialMessage } from "@/components/common/social-message";
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Footer } from "./footer";
import nprogress from "nprogress";
import "nprogress/nprogress.css";
nprogress.configure({ showSpinner: false });

interface Props {
    children: React.ReactNode;
    isContainer?: boolean;
    isShowMegaMenu?: boolean;
    isShowNewsletterSection?: boolean;
}

const BaseLayoutContent = ({
    children,
    isContainer = true,
    isShowMegaMenu = true,
    isShowNewsletterSection = false,
}: Props) => {
    useGetCart();
    useGetWishlist();
    const config = useConfig();
    const location = useLocation();

    const isSticky = getConfig(config, "header_stikcy")?.value;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    useEffect(() => {
        nprogress.start();
        nprogress.done();
    }, [location.pathname]);

    const headerContent = useMemo(
        () => (
            <nav className={`${isSticky ? "sticky top-0 z-50" : ""}`}>
                <HeaderDesktop isShowMegaMenu={isShowMegaMenu} />
                <HeaderMobile />
            </nav>
        ),
        [isSticky, isShowMegaMenu],
    );

    return (
        <section className="min-h-screen flex flex-col">
            {headerContent}

            <section
                className={`${
                    isContainer ? "container mx-auto px-0 xl:px-6" : ""
                } flex-1 md:pt-0 md:pb-0`}
            >
                {children}
            </section>
            <footer>
                <Footer isShowNewsletterSection={isShowNewsletterSection} />
                <FooterMobile />
            </footer>
            <SocialMessage />
        </section>
    );
};

export const BaseLayout = (props: Props) => {
    return <BaseLayoutContent {...props} />;
};
