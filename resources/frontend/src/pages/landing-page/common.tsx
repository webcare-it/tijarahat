import "swiper/css";
import "swiper/css/pagination";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Logo } from "@/components/layout/header/logo";
import type { LandingPageType } from "./type";
import { useEffect, useState } from "react";
import {
    OptimizedBannerImage,
    OptimizedImage,
} from "@/components/common/optimized-image";
import { RenderHtml } from "@/components/html";

interface Props {
    info: LandingPageType;
}

interface TitleProps {
    children: React.ReactNode;
    className?: string;
}

export const HeaderSection = () => {
    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <div className="px-4 sm:px-0 mb-8">
                <div className="flex justify-center items-center">
                    <Logo type="LANDING-PAGE" />
                </div>
            </div>
        </motion.header>
    );
};

export const Title = ({ children, className }: TitleProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={cn(className)}
        >
            <motion.h1
                className="text-4xl pb-6 md:pb-8 text-center md:text-6xl font-bold text-primary"
                style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}
            >
                {children}
            </motion.h1>
        </motion.div>
    );
};

export const SubTitle = ({ children, className }: TitleProps) => {
    return children ? (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={cn("pb-4 md:pb-6", className)}
        >
            <motion.h2
                className="text-2xl text-center md:text-4xl font-bold text-muted-foreground"
                style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}
            >
                {children}
            </motion.h2>
        </motion.div>
    ) : null;
};

export const ProductShowcaseSection = ({ info }: Props) => {
    const images = info?.images?.map((img) => img?.image) || [];

    return (
        <div>
            <Title>Premium Quality Products</Title>``
            <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={16}
                loop={true}
                speed={500}
                autoplay={{ delay: 2000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                breakpoints={{
                    0: { slidesPerView: 1 },
                    480: { slidesPerView: 1 },
                    600: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                    1280: { slidesPerView: 4 },
                }}
                className="mySwiper"
            >
                {Array.from({ length: 5 }, (_, index) => {
                    const imageIndex = index % images?.length;
                    return (
                        <SwiperSlide key={index}>
                            <div className="px-2">
                                <div className="rounded-lg bg-blue-50 border border-blue-100 shadow-md overflow-hidden relative aspect-[16/26]">
                                    <OptimizedImage
                                        src={images?.[imageIndex] || ""}
                                        alt={`Product ${index + 1}`}
                                        className="w-full h-full absolute object-cover"
                                    />
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
            <OrderButton />
        </div>
    );
};

export const BenefitsSection = ({ info }: Props) => {
    const renderHtml = (html: string) => {
        return (
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <RenderHtml html={html} />
            </motion.div>
        );
    };

    const hasTextContent = (html: string | undefined): boolean => {
        if (!html) return false;

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        const textContent = tempDiv.textContent || tempDiv.innerText || "";

        return textContent.trim().length > 0;
    };

    const features = [info?.feature_1, info?.feature_2].filter((feature) =>
        hasTextContent(feature),
    );

    if (features?.length === 0) {
        return null;
    }

    return (
        <div>
            <Title>{info?.short_description} </Title>
            <div
                className={`grid grid-cols-1 gap-8 md:grid-cols-${features?.length >= 2 ? 2 : 1} items-baseline md:gap-6`}
            >
                {features &&
                    features?.map((feature, index) => (
                        <div
                            className="border rounded-lg p-3 md:p-4 h-auto"
                            key={index}
                        >
                            {renderHtml(feature)}
                        </div>
                    ))}
            </div>
        </div>
    );
};

export const WhatOurCustomersSaySection = ({ info }: Props) => {
    const images = info?.reviews?.map((img) => img?.review_image) || [];

    return images?.length > 0 ? (
        <div>
            <Title>Customer Reviews</Title>
            <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={16}
                loop={true}
                speed={500}
                autoplay={{ delay: 1500, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                breakpoints={{
                    0: { slidesPerView: 2 },
                    480: { slidesPerView: 2 },
                    600: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                    1280: { slidesPerView: 5 },
                }}
                className="mySwiper"
            >
                {images?.length > 0 &&
                    images?.map((img, index) => (
                        <SwiperSlide key={index}>
                            <div className="rounded-lg bg-blue-50 border border-blue-100 shadow-md overflow-hidden cursor-grab">
                                <OptimizedImage
                                    src={img || ""}
                                    alt={`Customer Review ${index + 1}`}
                                    className="aspect-[16/26] h-full w-full object-contain rounded-lg"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
            </Swiper>
        </div>
    ) : null;
};

export const OrderButton = () => {
    const scrollToOrder = () => {
        document
            .getElementById("order-section")
            ?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="flex justify-center items-center py-8">
            <motion.button
                onClick={scrollToOrder}
                className="bg-primary text-primary-foreground px-7 md:px-10 py-2.5 md:py-5 rounded-full font-bold text-xl shadow-2xl cursor-pointer"
                animate={{
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatType: "reverse",
                }}
                whileHover={{
                    scale: 1.25,
                    boxShadow: "0 10px 40px 0 rgba(0, 0, 0, 0.4)",
                    transition: { duration: 0.3 },
                }}
                whileTap={{
                    scale: 0.95,
                    transition: { duration: 0.1 },
                }}
            >
                Order Now
            </motion.button>
        </div>
    );
};

export const BannerSection = ({ info }: Props) => {
    return (
        <div>
            {info?.banner_image ? (
                <div className="relative aspect-video rounded-lg overflow-hidden">
                    <OptimizedBannerImage
                        src={info?.banner_image || ""}
                        alt="banner"
                        className="w-full h-full object-cover absolute"
                    />
                </div>
            ) : null}
            {info?.banner_image ? <OrderButton /> : null}
        </div>
    );
};

export const VideoSection = ({ info }: Props) => {
    return (
        <div>
            {info?.video_id ? (
                <div className="aspect-video relative rounded-lg overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mx-auto">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${info?.video_id}?autoplay=1&mute=1`}
                                title="Product Demo"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            />
                        </div>
                    </motion.div>
                </div>
            ) : null}
            {info?.video_id ? <OrderButton /> : null}
        </div>
    );
};

export const DateCounter = ({ date }: { date: string }) => {
    const targetDate = new Date(date).getTime();

    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance > 0) {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor(
                        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
                    ),
                    minutes: Math.floor(
                        (distance % (1000 * 60 * 60)) / (1000 * 60),
                    ),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000),
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (targetDate < Date.now()) {
        return null;
    }

    return (
        <div className="flex flex-col items-center">
            <motion.h2
                className="text-3xl font-bold text-foreground mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {"Offer Ends In"}
            </motion.h2>

            <div className="flex gap-2 md:gap-4">
                <motion.div
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <motion.div
                        className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg"
                        animate={{
                            boxShadow: [
                                "0 0 0px rgba(239, 68, 68, 0.5)",
                                "0 0 20px rgba(239, 68, 68, 0.8)",
                                "0 0 0px rgba(239, 68, 68, 0.5)",
                            ],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <span className="text-2xl md:text-3xl font-bold text-white">
                            {timeLeft.days.toString().padStart(2, "0")}
                        </span>
                    </motion.div>
                    <span className="mt-2 text-sm font-semibold text-muted-foreground">
                        {"Days"}
                    </span>
                </motion.div>

                <motion.div
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <motion.div
                        className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg"
                        animate={{
                            boxShadow: [
                                "0 0 0px rgba(59, 130, 246, 0.5)",
                                "0 0 20px rgba(59, 130, 246, 0.8)",
                                "0 0 0px rgba(59, 130, 246, 0.5)",
                            ],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5,
                        }}
                    >
                        <span className="text-2xl md:text-3xl font-bold text-white">
                            {timeLeft.hours.toString().padStart(2, "0")}
                        </span>
                    </motion.div>
                    <span className="mt-2 text-sm font-semibold text-muted-foreground">
                        {"Hours"}
                    </span>
                </motion.div>

                <motion.div
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <motion.div
                        className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg"
                        animate={{
                            boxShadow: [
                                "0 0 0px rgba(34, 197, 94, 0.5)",
                                "0 0 20px rgba(34, 197, 94, 0.8)",
                                "0 0 0px rgba(34, 197, 94, 0.5)",
                            ],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1,
                        }}
                    >
                        <span className="text-2xl md:text-3xl font-bold text-white">
                            {timeLeft.minutes.toString().padStart(2, "0")}
                        </span>
                    </motion.div>
                    <span className="mt-2 text-sm font-semibold text-muted-foreground">
                        {"Minutes"}
                    </span>
                </motion.div>

                <motion.div
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <motion.div
                        className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg"
                        animate={{
                            boxShadow: [
                                "0 0 0px rgba(168, 85, 247, 0.5)",
                                "0 0 20px rgba(168, 85, 247, 0.8)",
                                "0 0 0px rgba(168, 85, 247, 0.5)",
                            ],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <span className="text-2xl md:text-3xl font-bold text-white">
                            {timeLeft.seconds.toString().padStart(2, "0")}
                        </span>
                    </motion.div>
                    <span className="mt-2 text-sm font-semibold text-muted-foreground">
                        {"Seconds"}
                    </span>
                </motion.div>
            </div>
            <motion.div
                className="mt-2 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
            >
                <p className="text-lg font-semibold text-gray-700">
                    {"Deadline"}:{" "}
                    <span className="text-red-600 font-bold">
                        {new Date(date).toLocaleDateString()}
                    </span>
                </p>
            </motion.div>
            <motion.div
                className="flex items-center"
                animate={{
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <span className="flex h-3 w-3 mr-2">
                    <span className="animate-ping absolute h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative h-3 w-3 rounded-full bg-red-500"></span>
                </span>
                <span className="text-sm font-bold text-red-600">
                    {"HURRY UP!"}
                </span>
            </motion.div>
        </div>
    );
};

export const PriceTicker = ({ info }: Props) => {
    const [currentPriceIndex, setCurrentPriceIndex] = useState(0);

    const prices = [
        {
            original: `৳${info?.regular_price}`,
            discounted: `৳${info?.discount_price}`,
            previousText: "Previous Price",
            offerText: "Offer Price",
        },
    ];

    const currentPrice = prices[currentPriceIndex];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPriceIndex((prev) => (prev + 1) % prices.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [prices.length]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-6 md:p-8 shadow-2xl border-4 border-red-500 relative overflow-hidden space-y-4"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="absolute inset-0">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500/20 via-transparent to-transparent"></div>
                        {[...Array(10)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                }}
                                animate={{
                                    scale: [0, 1, 0],
                                    opacity: [0, 1, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                }}
                            />
                        ))}
                    </div>

                    <div className="flex items-center justify-center gap-4">
                        <motion.h2
                            className="text-white text-xl md:text-2xl font-bold z-10 relative"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {currentPrice.previousText}
                        </motion.h2>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 z-10 relative">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <motion.div
                                        className="line-through text-gray-300 text-[28px] font-bold"
                                        key={`original-${currentPriceIndex}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {currentPrice.original}
                                    </motion.div>

                                    <motion.div
                                        className="absolute inset-0 flex items-center justify-center"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1 }}
                                    >
                                        <motion.svg
                                            width="100%"
                                            height="100%"
                                            viewBox="0 0 100 40"
                                            className="absolute"
                                        >
                                            <motion.path
                                                d="M 20 20 L 80 20"
                                                stroke="red"
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{
                                                    pathLength: [0, 1, 0],
                                                }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: 1,
                                                    repeat: Infinity,
                                                }}
                                            />
                                            <motion.path
                                                d="M 80 20 L 20 20"
                                                stroke="red"
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{
                                                    pathLength: [0, 1, 0],
                                                }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: 1.2,
                                                    repeat: Infinity,
                                                }}
                                            />
                                        </motion.svg>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <motion.h2
                            className="text-white text-xl md:text-2xl font-bold z-10 relative"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {currentPrice.offerText}
                        </motion.h2>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 z-10 relative">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <motion.div
                                        className="text-white text-[32px] font-extrabold"
                                        key={`discounted-${currentPriceIndex}`}
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.5, opacity: 0 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 15,
                                        }}
                                    >
                                        {currentPrice.discounted}
                                    </motion.div>

                                    <motion.svg
                                        className="absolute inset-0 -left-6 -top-6"
                                        width="180"
                                        height="80"
                                        viewBox="0 0 180 80"
                                    >
                                        <motion.path
                                            d="M 90 15 A 75 30 0 1 0 90.1 15"
                                            fill="none"
                                            stroke="yellow"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: [0, 1, 0] }}
                                            transition={{
                                                duration: 2,
                                                delay: 1.5,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                        />
                                    </motion.svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export const FooterLanding = ({ info }: Props) => {
    const copyright =
        info?.copyright_text ||
        `${new Date().getFullYear()} All rights reserved.`;
    return (
        <div className="h-20 bg-gray-900 mt-10 flex items-center justify-center">
            <div className="flex justify-center gap-1">
                <p className="w-full text-white overflow-hidden flex">
                    ©{copyright}
                </p>
            </div>
        </div>
    );
};
