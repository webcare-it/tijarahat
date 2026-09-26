import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "./skeleton";
import { Button } from "../ui/button";
import { useIsMobile } from "@/hooks/useMobile";

interface Props {
    title: string;
    linkText?: string;
    href?: string;
    className?: string;
}

export const SectionTitle = ({
    title,
    linkText,
    href,
    className = "mb-6 md:mb-8",
}: Props) => {
    return (
        <div
            className={`flex flex-wrap justify-between items-center md:gap-2 px-4 md:px-0 ${className}`}
        >
            <h2 className="text-lg font-bold md:text-3xl lg:text-4xl text-primary tracking-tight flex">
                {title}
            </h2>

            {linkText && href && (
                <Link
                    to={href}
                    className="flex items-center gap-1 text-base font-medium text-primary hover:text-primary/80 transition-colors group"
                >
                    {linkText}
                    <ArrowRight className="w-6 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            )}
        </div>
    );
};

interface NewProps {
    title: string;
    className?: string;
    children?: React.ReactNode;
    href?: string;
}

export const HomeSectionTitle = ({
    title,
    className = "mb-0 md:mb-4",
    href,
    children,
}: NewProps) => {
    const isMobile = useIsMobile();
    return (
        <>
            <div
                className={`flex justify-center items-center px-4 md:px-0 ${className}`}
            >
                <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl text-primary tracking-tight flex">
                    {title}
                </h2>
            </div>
            {children ? children : null}
            {href && (
                <div className="flex justify-center items-center mt-2 md:mt-4">
                    <Link to={href}>
                        <Button size={isMobile ? "sm" : "default"}>
                            View All
                            <ArrowRight className="w-6 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            )}
        </>
    );
};

export const HomeSectionTitleSkeleton = () => {
    return (
        <div className="flex justify-center items-center md:gap-2 px-4 md:px-0">
            <h2 className="text-lg line-clamp-1 font-bold md:text-3xl lg:text-4xl text-primary tracking-tight flex">
                <Skeleton className="h-7 md:h-9 lg:h-12 w-[250px] md:w-[300px] lg:w-[400px] rounded-lg" />
            </h2>
        </div>
    );
};

export const SectionTitleSkeleton = () => {
    return (
        <div className="flex justify-between items-start sm:items-end gap-4 mb-6 md:mb-8 px-4 md:px-0">
            <div className="flex items-end">
                <Skeleton className="h-8 md:h-10 lg:h-14 w-[250px] md:w-xs lg:w-xl rounded-lg" />
                <Skeleton className="h-1 w-10 md:w-24 lg:w-36 rounded-lg" />
            </div>
        </div>
    );
};
