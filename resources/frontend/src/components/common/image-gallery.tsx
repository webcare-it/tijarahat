import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Fullscreen, ZoomIn } from "lucide-react";
import type { ProductDetailsType, ProductType } from "@/type";
import { WishlistButton } from "./wishlist-button";
import { Discount } from "./discount";
import { getImageUrl } from "@/helper";
import { OptimizedImage } from "./optimized-image";
import { placeholder } from "@/assets";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface Props {
    className?: string;
    img: string | null;
    product: ProductDetailsType;
}

export const ImageGallery = ({ img, product, className }: Props) => {
    const [isZoomed, setIsZoomed] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [imgUrl, setImgUrl] = useState<string | null>(img || null);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [thumbnailScrollPosition, setThumbnailScrollPosition] = useState(0);
    const [visibleThumbnails, setVisibleThumbnails] = useState(3);

    const [lightboxOpen, setLightboxOpen] = useState(false);

    const images = useMemo(() => {
        const imageUrls = product?.photos?.map((photo) => photo?.path) || [];
        return [...new Set(imageUrls)];
    }, [product?.photos]);

    const slides = useMemo(() => {
        return images.map((image) => ({
            src: getImageUrl(image) || placeholder,
        }));
    }, [images]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isZoomed) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPosition({ x, y });
    };

    const nextImage = () => {
        const nextIndex = (selectedImage + 1) % images.length;
        setSelectedImage(nextIndex);
        setImgUrl(images[nextIndex] || null);
    };

    const prevImage = () => {
        const prevIndex = (selectedImage - 1 + images.length) % images.length;
        setSelectedImage(prevIndex);
        setImgUrl(images[prevIndex] || null);
    };

    const scrollThumbnailsLeft = () => {
        setThumbnailScrollPosition((prev) => Math.max(0, prev - 1));
    };

    const scrollThumbnailsRight = () => {
        const maxScroll = Math.max(0, images.length - visibleThumbnails);
        setThumbnailScrollPosition((prev) => Math.min(maxScroll, prev + 1));
    };

    const openLightbox = () => {
        setLightboxOpen(true);
    };

    useEffect(() => {
        const calculateVisibleThumbnails = () => {
            const thumbnailHeight = window.innerWidth < 768 ? 64 : 80;
            const gap = 8;
            const containerHeight = window.innerHeight * 0.6;
            const calculated = Math.floor(
                containerHeight / (thumbnailHeight + gap),
            );
            setVisibleThumbnails(Math.max(2, calculated));
        };

        calculateVisibleThumbnails();
        window.addEventListener("resize", calculateVisibleThumbnails);
        return () =>
            window.removeEventListener("resize", calculateVisibleThumbnails);
    }, []);

    useEffect(() => {
        if (img && images.length > 0) {
            const index = images.findIndex((image) => image === img);
            if (index !== -1) {
                setSelectedImage(index);
                setImgUrl(img);
            }
        }
    }, [img, images]);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
            >
                <div className="flex gap-1 md:gap-4">
                    {images.length > 1 && (
                        <div className="relative flex flex-col gap-2">
                            {images.length > visibleThumbnails &&
                                thumbnailScrollPosition > 0 && (
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={scrollThumbnailsLeft}
                                        className="absolute cursor-pointer -top-2 left-1/2 -translate-x-1/2 z-10 bg-white/90 border border-primary/20 hover:bg-white text-primary p-1 rounded-full shadow-lg"
                                    >
                                        <ChevronLeft
                                            size={16}
                                            className="rotate-90"
                                        />
                                    </motion.button>
                                )}

                            {images.length > visibleThumbnails &&
                                thumbnailScrollPosition <
                                    images.length - visibleThumbnails && (
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={scrollThumbnailsRight}
                                        className="absolute cursor-pointer -bottom-2 left-1/2 -translate-x-1/2 z-10 bg-white/90 border border-primary/20 hover:bg-white text-primary p-1 rounded-full shadow-lg"
                                    >
                                        <ChevronRight
                                            size={16}
                                            className="rotate-90"
                                        />
                                    </motion.button>
                                )}

                            <div
                                className={`flex flex-col gap-2 overflow-hidden ${className ? className : "h-auto max-h-[280px] md:max-h-[90vh]"} select-none`}
                            >
                                <div
                                    className="flex flex-col gap-2 transition-transform duration-300 ease-in-out"
                                    style={{
                                        transform: `translateY(-${thumbnailScrollPosition * (80 + 8)}px)`,
                                    }}
                                >
                                    {images.map((image, index) => (
                                        <motion.button
                                            key={index}
                                            onClick={() => {
                                                setSelectedImage(index);
                                                setImgUrl(image);
                                            }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`relative size-16 cursor-pointer md:size-20 overflow-hidden border-2 transition-all flex-shrink-0 select-none rounded-lg ${
                                                selectedImage === index
                                                    ? "border-primary"
                                                    : "border-accent/20 hover:border-accent/50"
                                            }`}
                                        >
                                            <OptimizedImage
                                                src={image || ""}
                                                alt={`Image ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            {selectedImage === index && (
                                                <motion.div
                                                    layoutId="selectedThumbnail"
                                                    className="absolute inset-0 border-2 border-primary rounded-lg"
                                                />
                                            )}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div
                        className="flex-1 relative w-full aspect-[16/17] rounded-2xl border border-primary/10 select-none bg-primary/5 overflow-hidden group cursor-zoom-in"
                        onMouseMove={handleMouseMove}
                        onMouseEnter={() => setIsZoomed(true)}
                        onMouseLeave={() => setIsZoomed(false)}
                    >
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={selectedImage}
                                src={
                                    imgUrl?.startsWith("/")
                                        ? imgUrl
                                        : getImageUrl(imgUrl as string) ||
                                          placeholder
                                }
                                onError={() => setImgUrl(placeholder)}
                                alt="Image Gallery"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: 1,
                                    scale: isZoomed ? 2 : 1,
                                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-full h-full object-cover select-none"
                            />
                        </AnimatePresence>

                        <WishlistButton
                            product={product as unknown as ProductType}
                            size="DEFAULT"
                        />
                        <Discount product={product} type="DETAILS" />

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            className="absolute top-2 right-2 bg-black/50 text-white p-2 flex items-center gap-2 rounded-lg"
                        >
                            <ZoomIn size={18} />
                        </motion.div>

                        {images.length > 1 && (
                            <>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={prevImage}
                                    className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 hover:border-primary/10 border border-primary/40 text-primary p-1.5 md:p-2 rounded-full opacity-0 group-hover:opacity-100 bg-white/90 select-none"
                                >
                                    <ChevronLeft size={20} />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={nextImage}
                                    className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 hover:border-primary/10 border border-primary/40 text-primary p-1.5 md:p-2 rounded-full opacity-0 group-hover:opacity-100 bg-white/90 select-none"
                                >
                                    <ChevronRight size={20} />
                                </motion.button>
                            </>
                        )}

                        <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-0.5 text-sm select-none rounded-full">
                            {selectedImage + 1} / {images.length}
                        </div>

                        <motion.button
                            onClick={openLightbox}
                            className="absolute cursor-pointer bottom-2 right-2 bg-black/50 text-white p-2 text-sm select-none hover:bg-black/70 transition-colors rounded-full"
                        >
                            <Fullscreen size={20} />
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={slides}
                index={selectedImage}
                carousel={{ finite: false }}
            />
        </>
    );
};
