import {
    Title,
    BannerSection,
    SubTitle,
    HeaderSection,
    DateCounter,
    FooterLanding,
    BenefitsSection,
    PriceTicker,
    ProductShowcaseSection,
    WhatOurCustomersSaySection,
    VideoSection,
} from "./common";
import { motion } from "framer-motion";
import { PackageX, Home, ArrowLeft, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductSection } from "./product";
import { useLandingPage } from "@/api/queries/useLandingPage";
import type { LandingPageType } from "./type";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LandingSkeleton } from "./skeleton";
import { GtmSeo } from "./gtm";
import { useEffect } from "react";
import { removeLocalStorage } from "@/helper";
import { SocialMessage } from "@/components/common/social-message";

export const LandingPage = () => {
    const { data, isLoading, slug } = useLandingPage();

    useEffect(() => {
        removeLocalStorage("token");
        removeLocalStorage("user_id");
        removeLocalStorage("order_completed");
        removeLocalStorage("guest_user_id");
        removeLocalStorage("selected_shipping_method");
        removeLocalStorage("selected_payment_method");
    }, []);

    if (isLoading) return <LandingSkeleton />;

    const landingData = (data?.data as LandingPageType[]) || [];

    if (landingData?.length === 0 && !isLoading) return <NoProductFoundUI />;
    const info = landingData?.[0] || {};

    const title = `${window.location.origin}/campaign/${slug}`;

    return (
        <>
            <GtmSeo info={info} />
            <main className="min-h-screen overflow-hidden">
                <HeaderSection />
                <section className="container mx-auto px-2 space-y-10 md:space-y-16">
                    <div>
                        <Title>{info?.title}</Title>
                        <SubTitle>{info?.sub_title}</SubTitle>
                    </div>

                    <VideoSection info={info} />
                    <BannerSection info={info} />

                    {info?.images?.length > 0 && (
                        <ProductShowcaseSection info={info} />
                    )}

                    {info?.regular_price && info?.discount_price && (
                        <PriceTicker info={info} />
                    )}

                    {info?.deadline && <DateCounter date={info?.deadline} />}

                    <BenefitsSection info={info} />

                    <WhatOurCustomersSaySection info={info} />

                    <ProductSection info={info} />
                </section>

                <FooterLanding info={info} />

                <SocialMessage land={title} />
            </main>
        </>
    );
};

const NoProductFoundUI = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md"
            >
                <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 p-8 md:p-12 text-center overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <motion.div
                            animate={{
                                x: [0, 100, 0],
                                y: [0, -100, 0],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
                        />
                        <motion.div
                            animate={{
                                x: [0, -80, 0],
                                y: [0, 120, 0],
                            }}
                            transition={{
                                duration: 18,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className="absolute -bottom-20 -right-20 w-72 h-72 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
                        />
                    </div>

                    <div className="relative z-10 space-y-8">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="mx-auto w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/50 dark:to-pink-900/50 rounded-full flex items-center justify-center"
                        >
                            <PackageX className="w-12 h-12 text-red-600 dark:text-red-400" />
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent"
                        >
                            {"No products found"}
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-muted-foreground text-base md:text-lg max-w-sm mx-auto leading-relaxed"
                        >
                            {
                                "Looks like we're all out of magic beans today. Check back soon —  new drops incoming!"
                            }
                        </motion.p>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-3 justify-center mt-10"
                        >
                            <Button
                                onClick={() => navigate("/")}
                                size="lg"
                                className={cn(
                                    "group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg transition-all duration-300",
                                    "flex items-center gap-2",
                                )}
                            >
                                <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                {"Back to Home"}
                                <span className="absolute inset-0 bg-white/20 translate-x-[-110%] group-hover:translate-x-0 transition-transform duration-500" />
                            </Button>

                            <Button
                                onClick={() => navigate(-1)}
                                size="lg"
                                variant="outline"
                                className={cn(
                                    "group font-medium rounded-xl border-2 transition-all duration-300",
                                    "hover:bg-slate-100 dark:hover:bg-slate-800",
                                )}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                                {"Go Back"}
                            </Button>

                            <Button
                                onClick={() => window.location.reload()}
                                size="lg"
                                variant="ghost"
                                className="font-medium rounded-xl"
                            >
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin-slow" />
                                {"Retry"}
                            </Button>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-xs text-muted-foreground/70 mt-12"
                        >
                            {"Pro tip: Sometimes a refresh works wonders"}
                        </motion.p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
