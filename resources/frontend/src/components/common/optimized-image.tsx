import { getImageUrl } from "@/helper";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface OptimizedImageProps {
    src: string;
    alt?: string;
    className?: string;
}

export const OptimizedImage = ({
    src,
    alt = "Image",
    className,
}: OptimizedImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const img = new Image();

        img.onload = () => {
            setIsLoaded(true);
            setHasError(false);
        };

        img.onerror = () => {
            setHasError(true);
        };

        img.src = getImageUrl(src) || "";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!isLoaded || hasError) {
        return (
            <div
                className={cn(
                    "bg-gray-200 flex items-center justify-center w-full h-full object-cover relative",
                    className,
                )}
            >
                <svg
                    className="w-8 h-8 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z" />
                    <rect
                        x="2"
                        y="2"
                        width="20"
                        height="20"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1"
                        fill="none"
                    />
                </svg>
            </div>
        );
    }

    return (
        <img
            src={getImageUrl(src) || ""}
            alt={alt}
            className={cn(
                "transition-opacity duration-300 opacity-100 relative w-full h-full",
                className,
            )}
            loading="lazy"
        />
    );
};

interface Props {
    src: string;
    alt: string;
    className?: string;
    timer?: number;
}

export const OptimizedBannerImage = ({ src, alt, className }: Props) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
        setHasError(false);

        const img = new Image();

        img.onload = () => {
            setIsLoaded(true);
            setHasError(false);
        };

        img.onerror = () => {
            setHasError(true);
        };

        img.src = getImageUrl(src) || "";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!isLoaded || hasError) {
        return (
            <div
                className={cn(
                    "bg-gray-200 flex items-center justify-center w-full h-full object-cover relative",
                    className,
                )}
            >
                <svg
                    className="w-8 h-8 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z" />
                    <rect
                        x="2"
                        y="2"
                        width="20"
                        height="20"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1"
                        fill="none"
                    />
                </svg>
            </div>
        );
    }

    return (
        <img
            src={getImageUrl(src) || ""}
            alt={alt}
            className={cn(
                "transition-opacity duration-300 opacity-100 relative w-full h-full",
                className,
            )}
            loading="lazy"
        />
    );
};
