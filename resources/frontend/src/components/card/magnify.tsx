import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { placeholder } from "@/assets";

interface Props {
    src: string;
    alt: string;
    className?: string;
    zoomFactor?: number;
    containerClassName?: string;
}

export const MagnifyImage = ({
    src,
    alt,
    className = "",
    zoomFactor = 2,
    containerClassName = "",
}: Props) => {
    const sourceRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [opacity, setOpacity] = useState(0);
    const [offset, setOffset] = useState({ left: 0, top: 0 });

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || !sourceRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const sourceRect = sourceRef.current.getBoundingClientRect();

        const mouseX = e.clientX - containerRect.left;
        const mouseY = e.clientY - containerRect.top;

        const offsetX = -(mouseX * (zoomFactor - 1));
        const offsetY = -(mouseY * (zoomFactor - 1));

        const maxOffsetX = 0;
        const minOffsetX = containerRect.width - sourceRect.width * zoomFactor;
        const maxOffsetY = 0;
        const minOffsetY =
            containerRect.height - sourceRect.height * zoomFactor;

        const clampedOffsetX = Math.max(
            minOffsetX,
            Math.min(maxOffsetX, offsetX)
        );
        const clampedOffsetY = Math.max(
            minOffsetY,
            Math.min(maxOffsetY, offsetY)
        );

        setOffset({ left: clampedOffsetX, top: clampedOffsetY });
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative cursor-crosshair aspect-[16/17] inline-block overflow-hidden h-full w-full rounded-xl",
                containerClassName
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
        >
            <img
                ref={sourceRef}
                src={src}
                alt={alt}
                onError={(e) => {
                    e.currentTarget.src = placeholder;
                }}
                className={cn("w-full h-full rounded-xl", className)}
            />

            <img
                src={src}
                alt={alt}
                onError={(e) => {
                    e.currentTarget.src = placeholder;
                }}
                className={cn(
                    "absolute pointer-events-none aspect-[16/17] transition-opacity duration-200 ease-in-out",
                    "rounded-xl",
                    className
                )}
                style={{
                    left: `${offset.left}px`,
                    top: `${offset.top}px`,
                    transform: `scale(${zoomFactor})`,
                    transformOrigin: "top left",
                    opacity: opacity,
                }}
            />
        </div>
    );
};
