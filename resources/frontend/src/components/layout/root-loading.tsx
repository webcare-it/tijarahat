import { useInitialLength } from "@/hooks/useMobile";
import { ProductCardSkeleton } from "../card/product";
import { CardLayout } from "../common/card-layout";
import { HomeSectionTitleSkeleton } from "../common/section-title";
import { Skeleton } from "../common/skeleton";

const SectionSkeleton = () => {
    const initialLength = useInitialLength();

    return (
        <div className="mb-16 md:mb-20">
            <div className="my-6">
                <HomeSectionTitleSkeleton />
            </div>

            <CardLayout>
                {Array.from({ length: initialLength }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </CardLayout>
        </div>
    );
};

const SectionPromotion = () => {
    return (
        <div className="w-full mb-16 px-2 md:px-0">
            <div className="mb-6">
                <HomeSectionTitleSkeleton />
            </div>
            <Skeleton className="w-full aspect-[16/5]" />
        </div>
    );
};

export const RootPageLoading = () => {
    return (
        <main className="min-h-screen flex flex-col">
            <header className="h-14 container mx-auto flex items-center w-full px-1 md:px-0 justify-between">
                <Skeleton className="w-40 h-10" />
                {/* // logo */}
                <div className="w-full hidden md:block max-w-xl mx-auto relative">
                    <Skeleton className="h-10 text-base rounded-md" />
                </div>

                {/* // input */}
                <div className="flex items-center gap-4 md:gap-6">
                    <Skeleton className="w-28 h-8 rounded hidden md:block" />
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton key={index} className="w-8 h-8 rounded" />
                    ))}
                </div>
            </header>
            {/* // action */}
            <div className="hidden md:block relative border border-border">
                <div className="container mx-auto">
                    <div className="flex items-center gap-2 justify-center py-1">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="w-36 h-8 rounded"
                            />
                        ))}
                    </div>
                </div>
            </div>
            {/* // banner */}
            <section className="container md:mx-auto">
                <div className="w-full mt-2 px-2 md:px-0 mb-4">
                    <div className="aspect-[16/5] relative">
                        <Skeleton className="w-full h-full absolute" />
                    </div>
                </div>
                {/* // category menu */}
                <div className="w-full py-10 md:py-16">
                    <div className="hidden md:flex gap-2 overflow-hidden justify-center">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center px-1 mx-1 sm:px-2 sm:mx-2 min-w-fit sm:min-w-0"
                            >
                                <Skeleton className="w-20 h-16 sm:w-24 sm:h-20 md:w-28 md:h-24 rounded-lg" />
                                <Skeleton className="mt-1 sm:mt-2 w-16 sm:w-18 md:w-20 h-3 sm:h-4 rounded" />
                            </div>
                        ))}
                    </div>
                    <div className="flex md:hidden gap-2 overflow-hidden justify-center">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center px-1 mx-1 sm:px-2 sm:mx-2 min-w-fit sm:min-w-0"
                            >
                                <Skeleton className="w-20 h-16 sm:w-24 sm:h-20 md:w-28 md:h-24 rounded-lg" />
                                <Skeleton className="mt-1 sm:mt-2 w-16 sm:w-18 md:w-20 h-3 sm:h-4 rounded" />
                            </div>
                        ))}
                    </div>
                </div>
                {/* // trusted badge */}
                <div className="container mx-auto hidden md:block mb-20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-5">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-full rounded-xl border border-primary/20 bg-white shadow-sm"
                            >
                                <div className="flex flex-col items-center text-center p-4">
                                    <div className="mb-3 p-4 rounded-full bg-primary/10">
                                        <Skeleton className="w-5 h-5 rounded-full" />
                                    </div>
                                    <Skeleton className="h-4 w-24 mb-2 rounded" />
                                    <Skeleton className="h-3 w-20 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <SectionSkeleton />
                <SectionPromotion />
                <SectionSkeleton />
                <SectionPromotion />
                <SectionSkeleton />
                <SectionPromotion />
                <SectionSkeleton />
                <SectionPromotion />
            </section>
            {/** footer */}
            <footer className="container mx-auto mt-16 px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6">
                    <div className="flex flex-col items-start justify-center gap-2">
                        <Skeleton className="w-56 h-16 rounded" />
                        <Skeleton className="w-56 h-4 rounded" />
                        <Skeleton className="w-56 h-4 rounded" />
                        <Skeleton className="w-56 h-4 rounded" />
                    </div>
                    <FooterItem />
                    <FooterItem />
                    <FooterItem />
                </div>
                <div className="border-t">
                    <div className="flex items-center justify-between mt-4 gap-2">
                        <Skeleton className="w-56 h-6 rounded" />
                        <Skeleton className="w-56 h-12 rounded" />
                    </div>
                </div>
            </footer>
        </main>
    );
};

const FooterItem = () => {
    return (
        <div className="flex flex-col items-start justify-start gap-2">
            <Skeleton className="w-56 h-12 rounded" />
            <Skeleton className="w-56 h-4 rounded" />
            <Skeleton className="w-56 h-4 rounded" />
            <Skeleton className="w-56 h-4 rounded" />
            <Skeleton className="w-56 h-4 rounded" />
            <Skeleton className="w-56 h-4 rounded" />
        </div>
    );
};
