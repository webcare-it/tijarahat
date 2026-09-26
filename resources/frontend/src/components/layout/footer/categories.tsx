import { Skeleton } from "@/components/common/skeleton";
import type { CategoryType } from "@/type";
import { Link, useLocation } from "react-router-dom";
import { slugify } from "@/helper";
import { useAllUtility } from "@/api/queries/useAllUtility";

export const CategoriesFooter = () => {
    const location = useLocation();
    const { data, isLoading } = useAllUtility();
    const categories = (data?.data?.categories?.data as CategoryType[]) || [];

    return (
        <div>
            <h4 className="text-white font-bold text-lg mb-4">
                Shop by Category
            </h4>
            <ul className="space-y-2">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="w-2/3 h-5 rounded" />
                    ))
                ) : (
                    <>
                        {categories?.slice(0, 4)?.map((item) => (
                            <li key={item?.name}>
                                <Link
                                    to={`/categories/${item?.id}/${slugify(item?.name)}`}
                                    className={`hover:text-primary/70 hover:underline transition-colors text-sm line-clamp-1 ${
                                        location.pathname ===
                                        `/categories/${item?.id}/${slugify(item?.name)}`
                                            ? "text-primary"
                                            : ""
                                    }`}
                                >
                                    {item?.name}
                                </Link>
                            </li>
                        ))}
                    </>
                )}
            </ul>
        </div>
    );
};
