import { Link } from "react-router-dom";
import { OptimizedBannerImage } from "./optimized-image";

export const ImageWithLink = ({
    item,
}: {
    item: { image: string | null; link: string | null };
}) => {
    return (
        <div className="w-full aspect-[16/6] overflow-hidden relative rounded-lg">
            {item?.link ? (
                <Link to={item?.link}>
                    <OptimizedBannerImage
                        src={item?.image || ""}
                        className="w-full h-full object-cover absolute inset-0 cursor-pointer"
                        alt="slider"
                    />
                </Link>
            ) : (
                <OptimizedBannerImage
                    src={item?.image || ""}
                    className="w-full h-full object-cover absolute inset-0 cursor-grab"
                    alt="slider"
                />
            )}
        </div>
    );
};
