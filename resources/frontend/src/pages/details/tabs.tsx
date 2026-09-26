import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getYouTubeEmbedUrl } from "@/helper";
import type { ProductDetailsType } from "@/type";
import { ProductReviews } from "./review";
import { useGetPolicy } from "@/api/queries/usePolicy";
import { Skeleton } from "@/components/common/skeleton";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { RenderHtml } from "@/components/html";

interface Props {
    product: ProductDetailsType;
}

export const ProductTabs = ({ product }: Props) => {
    return (
        <div className="mt-6 md:mt-8 mx-4 md:mx-auto">
            <Tabs defaultValue="description" className="w-full">
                <TabsList className="flex w-full overflow-x-auto">
                    <TabsTrigger
                        value="description"
                        className="flex-shrink-0 md:whitespace-nowrap cursor-pointer"
                    >
                        Details
                    </TabsTrigger>
                    <TabsTrigger
                        value="policy"
                        className="flex-shrink-0 md:whitespace-nowrap cursor-pointer"
                    >
                        Return Policy
                    </TabsTrigger>
                    <TabsTrigger
                        value="video"
                        className="flex-shrink-0 md:whitespace-nowrap cursor-pointer"
                    >
                        Video
                    </TabsTrigger>
                    <TabsTrigger
                        value="reviews"
                        className="flex-shrink-0 md:whitespace-nowrap cursor-pointer"
                    >
                        Reviews
                    </TabsTrigger>
                    {product?.pdf && (
                        <TabsTrigger
                            value="specification"
                            className="flex-shrink-0 md:whitespace-nowrap cursor-pointer"
                        >
                            PDF Specification
                        </TabsTrigger>
                    )}
                </TabsList>

                <TabsContent value="description" className="mt-6">
                    {product?.description ? (
                        <div className="w-full overflow-hidden px-4 md:px-6">
                            <RenderHtml html={product.description} />
                        </div>
                    ) : (
                        <p className="text-muted-foreground">
                            No product description available.
                        </p>
                    )}
                </TabsContent>

                <TabsContent value="policy" className="mt-4">
                    <div>
                        <h3 className=" text-base md:text-lg font-semibold text-foreground">
                            Product Return Policy
                        </h3>
                        <ReturnPolicy />
                    </div>
                </TabsContent>

                <TabsContent value="video" className="mt-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">
                            Product Video
                        </h3>
                        {product?.video_link ? (
                            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                                <iframe
                                    src={
                                        getYouTubeEmbedUrl(
                                            product.video_link,
                                        ) || ""
                                    }
                                    title="Product Video"
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        ) : (
                            <div className="aspect-video md:aspect-[16/4] bg-muted rounded-lg overflow-hidden">
                                <div className="flex items-center justify-center w-full h-full">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg
                                                className="w-8 h-8 text-primary"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                        <p className="text-muted-foreground">
                                            {
                                                "Product video will be available soon"
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                    <ProductReviews />
                </TabsContent>
                <TabsContent value="specification" className="mt-6">
                    {product?.pdf && (
                        <div className="flex justify-center items-center my-2 md:my-4">
                            <Link
                                to={`${window.location.origin}/${product.pdf}`}
                                target="_blank"
                            >
                                <Button>View PDF Specification</Button>
                            </Link>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

const ReturnPolicy = () => {
    const { data, isLoading } = useGetPolicy();

    const content = data?.data?.[0]?.content as string;

    return (
        <div className="mt-4 md:mt-6 flex items-center gap-2">
            {isLoading ? (
                <div className="flex flex-col gap-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <Skeleton key={i} className="h-4 w-full" />
                    ))}
                </div>
            ) : content ? (
                <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            ) : (
                <div>No Return Policy found </div>
            )}
        </div>
    );
};
