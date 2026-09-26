import React from "react";
import { Helmet } from "react-helmet-async";
import { useConfig } from "@/hooks/useConfig";
import { getConfig, getImageUrl } from "@/helper";

export const SeoProvider = ({ children }: { children: React.ReactNode }) => {
    const config = useConfig();
    const siteIcon = getConfig(config, "site_icon")?.value as string;
    const siteName =
        (getConfig(config, "website_name")?.value as string) || "E-commerce";
    const siteMotto = getConfig(config, "site_motto")?.value as string;
    const title = getConfig(config, "meta_title")?.value as string;
    const description = getConfig(config, "meta_description")?.value as string;
    const keywords = getConfig(config, "meta_keywords")?.value as string;
    const metaImage = getConfig(config, "meta_image")?.value as string;

    return (
        <React.Fragment>
            <Helmet>
                <title>{`${siteName} | ${siteMotto}`}</title>
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <link rel="icon" href={getImageUrl(siteIcon as string)} />
                <meta
                    property="og:image"
                    content={getImageUrl(metaImage as string)}
                />
                <meta
                    name="facebook-domain-verification"
                    content={
                        (getConfig(config, "fb_domain_code")
                            ?.value as string) || ""
                    }
                />
                <meta property="og:title" content={title || siteName} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content={siteName} />
                <meta property="og:locale" content="en_US" />
                <meta property="og:locale:alternate" content="bn_BD" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:type" content="image/jpeg" />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:type" content="image/jpg" />
                <meta property="og:image:type" content="image/webp" />
                <meta property="og:image:alt" content={title || siteName} />
                <meta
                    property="og:image:url"
                    content={getImageUrl(metaImage as string)}
                />
                <meta
                    property="og:image:secure_url"
                    content={getImageUrl(metaImage as string)}
                />
            </Helmet>
            {children}
        </React.Fragment>
    );
};
