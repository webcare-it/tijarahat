import { Separator } from "@/components/ui/separator";
import { BottomBar } from "./bottom";
import { ContactFooter } from "./contact";
import { CategoriesFooter } from "./categories";
import { BrandFooter } from "./brand";
import { AboutUsFooter } from "./about";
import { getConfig } from "@/helper";
import { useConfig } from "@/hooks/useConfig";
import { SubscribeFooter } from "./subscribe";
import { OptimizedImage } from "@/components/common/optimized-image";

export const Footer = ({
    isShowNewsletterSection,
}: {
    isShowNewsletterSection?: boolean;
}) => {
    const config = useConfig();
    const logo = getConfig(config, "footer_logo")?.value as string;
    const description = getConfig(config, "about_us_description")
        ?.value as string;

    return (
        <>
            {isShowNewsletterSection && <SubscribeFooter />}

            <div className="bg-gray-900 border-t text-white pt-10 md:pt-16 border-border pb-24 md:pb-0">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                        <div className="flex flex-col gap-3">
                            <div className="w-full h-20 relative overflow-hidden">
                                <OptimizedImage
                                    className="absolute w-full h-full object-contain"
                                    src={logo || ""}
                                    alt="logo"
                                />
                            </div>
                            {description && (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: description,
                                    }}
                                />
                            )}
                        </div>
                        <CategoriesFooter />
                        <BrandFooter />
                        <AboutUsFooter />
                        <ContactFooter />
                    </div>
                    <Separator className="bg-muted mt-4" />
                    <BottomBar />
                </div>
            </div>
        </>
    );
};
