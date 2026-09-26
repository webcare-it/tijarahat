import { useGetCustomPage } from "@/api/queries/usePolicy";
import { NoDataFound } from "@/components/common/no-data-found";
import { HomeSectionTitle } from "@/components/common/section-title";
import { SeoWrapper } from "@/components/common/seo-wrapper";
import { Skeleton } from "@/components/common/skeleton";
import { RenderHtml } from "@/components/html";
import { BaseLayout } from "@/components/layout/base-layout";

interface SupportPolicyPage {
    content: string;
    created_at: string;
    id: number;
    keywords: string | null;
    meta_description: string | null;
    meta_image: string | null;
    meta_title: string | null;
    slug: string;
    title: string;
    type: "support_policy_page";
    updated_at: string;
}

export const PolicyPage = () => {
    const { data, isLoading, key } = useGetCustomPage();

    const info = (data?.data as SupportPolicyPage) || {};

    return (
        <>
            <SeoWrapper
                title={info?.meta_title || info?.title || `Policy ${key}`}
            />
            <BaseLayout isShowMegaMenu={false}>
                <div className="my-10 md:my-16">
                    {isLoading ? (
                        <div className="flex flex-col gap-4">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <Skeleton key={i} className="h-4 w-full" />
                            ))}
                        </div>
                    ) : info?.content ? (
                        <article>
                            <HomeSectionTitle
                                title={info?.title || `Policy ${key}`}
                            />
                            <RenderHtml html={info?.content || ""} />
                        </article>
                    ) : (
                        <NoDataFound title={"No policy found"} />
                    )}
                </div>
            </BaseLayout>
        </>
    );
};
