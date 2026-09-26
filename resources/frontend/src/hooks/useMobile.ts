import * as React from "react";

export const MOBILE_BREAKPOINT = 768;
export const THREE_COLUMN_BREAKPOINT = 1024;
export const TABLET_BREAKPOINT = 1279;
export const DESKTOP_BREAKPOINT = 1535;

export const useIsMobile = () => {
    const [isMobile, setIsMobile] = React.useState<boolean>(false);

    React.useEffect(() => {
        const mql = window.matchMedia(
            `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
        );
        const onChange = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        };
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        mql.addEventListener("change", onChange);
        return () => mql.removeEventListener("change", onChange);
    }, []);

    return isMobile;
};

export const useWindowWidth = () => {
    const [windowWidth, setWindowWidth] = React.useState<number>(0);

    React.useEffect(() => {
        setWindowWidth(window.innerWidth);

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowWidth;
};

export const useInitialLength = () => {
    const windowWidth = useWindowWidth();

    if (windowWidth < MOBILE_BREAKPOINT) return 2;
    if (windowWidth < THREE_COLUMN_BREAKPOINT) return 3;
    if (windowWidth < TABLET_BREAKPOINT) return 4;
    if (windowWidth >= DESKTOP_BREAKPOINT) return 6;

    return 5;
};
