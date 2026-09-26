import { useMemo } from "react";
import { slugify } from "@/helper";
import { useAllUtility } from "@/api/queries/useAllUtility";

export type CategoryType = {
    id: number;
    name: string;
    banner: string;
    icon: string;
    number_of_children: number;
    links: {
        products: string;
        sub_categories: string;
    };
    sub_categories: SubCategoryType[];
};

export type SubCategoryType = {
    id: number;
    name: string;
    banner: string;
    icon: string;
    number_of_children: number;
    links: {
        products: string;
    };
    sub_sub_categories: SubSubCategoryType[];
};

export type SubSubCategoryType = {
    id: number;
    name: string;
    banner: string;
    icon: string;
    number_of_children: number;
    links: {
        products: string;
    };
};

export interface MenuItemType {
    name: string;
    href: string;
    submenu?: {
        columns: {
            href: string;
            title: string;
            links: { name: string; href: string; highlight?: boolean }[];
        }[];
        promos?: {
            image: string;
            title: string;
            link: string;
        }[];
    };
}

export const useMenuData = () => {
    const { data, isLoading, error } = useAllUtility();

    const categories = data?.data?.categories?.data as CategoryType[];

    const menuData = useMemo(() => {
        if (!categories) return [];

        return categories.map((category) => {
            if (
                !category?.sub_categories ||
                category?.sub_categories?.length === 0
            ) {
                return {
                    name: category?.name,
                    href: `/categories/${category?.id}/${slugify(category?.name)}`,
                };
            }

            const columns = category?.sub_categories?.map(
                (subCategory: SubCategoryType) => ({
                    title: subCategory?.name,
                    href: `/categories/${category?.id}/${slugify(category?.name)}/${
                        subCategory?.id
                    }/${slugify(subCategory?.name)}`,
                    links: subCategory?.sub_sub_categories?.map(
                        (subSubCategory: SubSubCategoryType) => ({
                            name: subSubCategory?.name,
                            href: `/categories/${category?.id}/${slugify(category?.name)}/${
                                subCategory?.id
                            }/${slugify(subCategory?.name)}/${subSubCategory?.id}/${slugify(
                                subSubCategory?.name,
                            )}`,
                            highlight: false,
                        }),
                    ),
                }),
            );

            const promos = category?.sub_categories
                ?.filter((sub: SubCategoryType) => sub?.banner)
                ?.slice(0, 2)
                ?.map((sub: SubCategoryType) => ({
                    image: (sub?.banner as string) || "",
                    title: sub?.name,
                    link: `/categories/${category?.id}/${slugify(category?.name)}/${
                        sub?.id
                    }/${slugify(sub?.name)}`,
                }));

            return {
                name: category?.name,
                href: `/categories/${category?.id}/${slugify(category?.name)}`,
                submenu: {
                    columns,
                    promos: promos?.length > 0 ? promos : undefined,
                },
            };
        });
    }, [categories]);

    return { menuData, isLoading, error };
};
