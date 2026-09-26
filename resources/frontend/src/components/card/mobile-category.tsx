import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    ChevronDown,
    ChevronRight,
    Image,
    LayoutList,
    LayoutPanelTop,
    Search,
} from "lucide-react";
import { getImageUrl, slugify } from "@/helper";
import { Input } from "@/components/ui/input";
import type {
    CategoryType,
    SubCategoryType,
    SubSubCategoryType,
} from "@/components/layout/header/useMenu";
import { OptimizedImage } from "../common/optimized-image";

interface Props {
    categories: CategoryType[];
    isLoading: boolean;
}

interface CategoryItemProps {
    category: CategoryType;
    level: number;
}

interface SubCategoryItemProps {
    subCategory: SubCategoryType;
    parentCategory: CategoryType;
    level: number;
}

interface SubSubCategoryItemProps {
    subSubCategory: SubSubCategoryType;
    parentCategory: CategoryType;
    parentSubCategory: SubCategoryType;
    level: number;
}

const CategoryItem = ({ category, level }: CategoryItemProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasSubCategories =
        category.sub_categories && category.sub_categories.length > 0;

    return (
        <div className="border-b border-border/50 last:border-b-0">
            <div className="flex items-center space-x-1 p-2 bg-background group">
                <Link
                    to={`/categories/${category?.id}/${slugify(
                        category?.name,
                    )}`}
                    className="flex-1 flex items-center gap-1 group-hover:bg-primary/5 rounded-r"
                >
                    <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-muted">
                        <OptimizedImage
                            src={category.icon}
                            alt={category.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm hover:text-primary transition-colors">
                            {category?.name}
                        </h3>
                        {category?.number_of_children > 0 && (
                            <p className="text-xs text-muted-foreground">
                                {category?.number_of_children} subcategories
                            </p>
                        )}
                    </div>
                </Link>

                {hasSubCategories && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        ) : (
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        )}
                    </button>
                )}
            </div>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    hasSubCategories && isExpanded
                        ? "max-h-[2000px] opacity-100"
                        : "max-h-0 opacity-0"
                }`}
            >
                <div className="bg-muted/30">
                    {category?.sub_categories?.map((subCategory, index) => (
                        <div
                            key={subCategory?.id}
                            className={`transition-all duration-200 ease-out ${
                                isExpanded
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 -translate-x-4"
                            }`}
                            style={{
                                transitionDelay: isExpanded
                                    ? `${index * 50}ms`
                                    : "0ms",
                            }}
                        >
                            <SubCategoryItem
                                subCategory={subCategory}
                                parentCategory={category}
                                level={level + 1}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const SubCategoryItem = ({
    subCategory,
    parentCategory,
    level,
}: SubCategoryItemProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasSubSubCategories =
        subCategory.sub_sub_categories &&
        subCategory.sub_sub_categories.length > 0;

    return (
        <div className="border-b border-border/30 last:border-b-0">
            <div className="flex items-center p-2 pl-4 gap-1 group">
                <Link
                    to={`/categories/${parentCategory?.id}/${slugify(
                        parentCategory?.name,
                    )}/${subCategory?.id}/${slugify(subCategory?.name)}`}
                    className="flex-1 flex items-center gap-1 group-hover:bg-primary/5 rounded-r"
                >
                    <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-muted relative">
                        {subCategory?.icon ? (
                            <img
                                src={getImageUrl(subCategory.icon)}
                                alt={subCategory?.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    const fallback = e.currentTarget
                                        .nextElementSibling as HTMLElement;
                                    if (fallback)
                                        fallback.style.display = "flex";
                                }}
                            />
                        ) : null}
                        <div
                            className={`w-full h-full flex items-center justify-center ${
                                subCategory?.icon ? "hidden" : "flex"
                            }`}
                            style={{
                                display: subCategory?.icon ? "none" : "flex",
                            }}
                        >
                            <LayoutPanelTop className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-primary/20 rounded-full" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground text-sm hover:text-primary transition-colors">
                            {subCategory?.name}
                        </h4>
                        {subCategory?.number_of_children > 0 && (
                            <p className="text-xs text-muted-foreground">
                                {subCategory?.number_of_children}{" "}
                                {"subcategories"}
                            </p>
                        )}
                    </div>
                </Link>

                {hasSubSubCategories && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        ) : (
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                    </button>
                )}
            </div>

            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    hasSubSubCategories && isExpanded
                        ? "max-h-[2000px] opacity-100"
                        : "max-h-0 opacity-0"
                }`}
            >
                <div className="bg-muted/20">
                    {subCategory?.sub_sub_categories?.map(
                        (subSubCategory, index) => (
                            <div
                                key={subSubCategory.id}
                                className={`transition-all duration-200 ease-out ${
                                    isExpanded
                                        ? "opacity-100 translate-x-0"
                                        : "opacity-0 -translate-x-4"
                                }`}
                                style={{
                                    transitionDelay: isExpanded
                                        ? `${index * 50}ms`
                                        : "0ms",
                                }}
                            >
                                <SubSubCategoryItem
                                    subSubCategory={subSubCategory}
                                    parentCategory={parentCategory}
                                    parentSubCategory={subCategory}
                                    level={level + 1}
                                />
                            </div>
                        ),
                    )}
                </div>
            </div>
        </div>
    );
};

const SubSubCategoryItem = ({
    subSubCategory,
    parentCategory,
    parentSubCategory,
}: SubSubCategoryItemProps) => {
    return (
        <Link
            to={`/categories/${parentCategory?.id}/${slugify(
                parentCategory?.name,
            )}/${parentSubCategory?.id}/${slugify(parentSubCategory?.name)}/${
                subSubCategory?.id
            }/${slugify(subSubCategory?.name)}`}
            className="flex items-center p-1 pl-8 border-b border-border/20 last:border-b-0"
        >
            <div className="flex-1 flex items-center gap-1">
                <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0 bg-muted relative">
                    {subSubCategory?.icon ? (
                        <img
                            src={getImageUrl(subSubCategory.icon)}
                            alt={subSubCategory?.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                                const fallback = e.currentTarget
                                    .nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = "flex";
                            }}
                        />
                    ) : null}
                    <div
                        className={`w-full h-full flex items-center justify-center ${
                            subSubCategory?.icon ? "hidden" : "flex"
                        }`}
                        style={{
                            display: subSubCategory?.icon ? "none" : "flex",
                        }}
                    >
                        <LayoutList className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-primary/30 rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                    <h5 className="font-normal text-foreground text-sm hover:text-primary transition-colors">
                        {subSubCategory?.name}
                    </h5>
                    {subSubCategory?.number_of_children > 0 && (
                        <p className="text-xs text-muted-foreground">
                            {subSubCategory?.number_of_children}{" "}
                            {"subcategories"}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
};

export const MobileCategory = ({ categories, isLoading }: Props) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCategories = useMemo(() => {
        if (!searchTerm?.trim()) return categories;

        return categories.filter((category) => {
            const matchesCategory = category?.name
                ?.toLowerCase()
                ?.toLowerCase()
                ?.includes(searchTerm?.toLowerCase());
            const matchesSubCategories = category?.sub_categories?.some(
                (sub) =>
                    sub?.name
                        ?.toLowerCase()
                        ?.includes(searchTerm?.toLowerCase()) ||
                    sub?.sub_sub_categories?.some((subSub) =>
                        subSub?.name
                            ?.toLowerCase()
                            ?.includes(searchTerm?.toLowerCase()),
                    ),
            );
            return matchesCategory || matchesSubCategories;
        });
    }, [categories, searchTerm]);

    if (isLoading) {
        return (
            <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="border-b border-border/50 p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-muted rounded-lg animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                                <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!categories || categories?.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-muted-foreground">
                    <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">
                        {"No categories found"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Try again later
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder={"Search categories..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 text-base"
                />
            </div>

            <div className="bg-background rounded-lg border border-border overflow-hidden">
                {filteredCategories?.length > 0 ? (
                    filteredCategories?.map((category, index) => (
                        <div
                            key={category?.id}
                            className="opacity-100 translate-y-0 transition-all duration-300 ease-out"
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <CategoryItem category={category} level={0} />
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <div className="text-muted-foreground">
                            <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">
                                {"No results found"}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                {"Try a different search term"}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
