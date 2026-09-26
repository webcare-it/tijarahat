import { useCallback, useEffect, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useConfig } from "@/hooks/useConfig";
import { getConfig } from "@/helper";

export const GoogleGtmTracker = () => {
    const config = useConfig();

    const isActive = getConfig(config, "google_analytics")?.value === "1";
    const gtmId = getConfig(config, "gtm_id")?.value as string;

    if (!isActive) return null;

    return <GtmTracker gtmId={gtmId} />;
};

const GtmTracker = ({ gtmId }: { gtmId?: string }) => {
    const location = useLocation();
    const scriptLoadedRef = useRef(false);
    const noscriptLoadedRef = useRef(false);
    const [searchParams] = useSearchParams();

    const GTM_ID = useCallback(() => gtmId || "GTM-522LcJVXS", [gtmId]);

    useEffect(() => {
        const gtmIdValue = GTM_ID();

        if (scriptLoadedRef.current) return;
        window.dataLayer = window.dataLayer || [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).dataLayer = (window as any).dataLayer || [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (function (w: any, d: Document, s: string, l: string, i: string) {
            w[l] = w[l] || [];
            w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
            const f = d.getElementsByTagName(s)[0];
            const j = d.createElement(s) as HTMLScriptElement;
            const dl = l !== "dataLayer" ? "&l=" + l : "";
            j.async = true;
            j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
            if (f?.parentNode) {
                f.parentNode.insertBefore(j, f);
            }
        })(window, document, "script", "dataLayer", gtmIdValue);

        scriptLoadedRef.current = true;

        return () => {
            const existingScript = document.querySelector(
                `script[src*="googletagmanager.com/gtm.js"]`,
            );
            if (existingScript) {
                existingScript.remove();
            }
            scriptLoadedRef.current = false;
        };
    }, [GTM_ID]);

    useEffect(() => {
        const gtmIdValue = GTM_ID();

        if (noscriptLoadedRef.current) return;

        const existingNoscript = document.querySelector(
            `noscript iframe[src*="googletagmanager.com/ns.html"]`,
        );
        if (existingNoscript) {
            noscriptLoadedRef.current = true;
            return;
        }

        const noscript = document.createElement("noscript");
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmIdValue}`;
        iframe.height = "0";
        iframe.width = "0";
        iframe.style.display = "none";
        iframe.style.visibility = "hidden";
        noscript.appendChild(iframe);
        document.body.insertBefore(noscript, document.body.firstChild);

        noscriptLoadedRef.current = true;

        return () => {
            const existingNoscript = document.querySelector(
                `noscript iframe[src*="googletagmanager.com/ns.html"]`,
            )?.parentElement;
            if (existingNoscript && existingNoscript.parentNode) {
                existingNoscript.parentNode.removeChild(existingNoscript);
            }
            noscriptLoadedRef.current = false;
        };
    }, [GTM_ID]);

    useEffect(() => {
        if (window.dataLayer) {
            window.dataLayer.push({
                event: "page_view",
                page_path: location.pathname + location.search,
                page_title: document.title,
            });
        }
    }, [location.pathname, location.search, searchParams]);

    return null;
};
