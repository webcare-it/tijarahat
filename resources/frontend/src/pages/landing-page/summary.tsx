import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetCampaignSummaryQuery } from "@/api/queries/useGetCart";
import { useSelector } from "react-redux";
import type { RootStateType } from "@/redux/store";
import { getConfig } from "@/helper";
import { useConfig } from "@/hooks/useConfig";
import { cn } from "@/lib/utils";
import { Coupon } from "@/components/card/coupon";
import { QuantityCampaign } from "./quantity";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useCampaignRemoveCart } from "@/controllers/campaignController";
import type { StateSyncType } from "@/type";
import { OptimizedImage } from "@/components/common/optimized-image";

interface CartSummaryType {
    sub_total: string;
    tax: string;
    shipping_cost: string;
    discount: string;
    grand_total: string;
    grand_total_value: number;
    coupon_code: string;
    coupon_applied: boolean;
}

interface Props {
    children: React.ReactNode;
    setSelectedShipping: (id: string) => void;
}

export const CampaignCartSummary = ({
    children,
    setSelectedShipping,
}: Props) => {
    const config = useConfig();

    const { data } = useGetCampaignSummaryQuery();
    const campaign = useSelector(
        (state: RootStateType) => state.campaign?.items,
    );
    const isActiveCoupon = getConfig(config, "coupon_system")?.value === "1";

    const cartSummary = (data as unknown as CartSummaryType) || {};

    return (
        <Card className={cn("p-4 md:p-6 md:sticky md:top-28 bg-card")}>
            <h2 className="text-xl font-bold text-foreground">ORDER SUMMERY</h2>

            {campaign?.length > 0 ? (
                <div className="flex flex-col gap-2">
                    {campaign?.map((item, index: number) => (
                        <div
                            key={item.id.toString() + index.toString()}
                            className="flex justify-between items-center border-b pb-2"
                        >
                            <div className="flex gap-1">
                                <div className="flex-shrink-0 w-20 h-16 sm:w-24 sm:h-20 relative rounded-lg border overflow-hidden">
                                    <OptimizedImage
                                        src={item?.image || ""}
                                        alt={item?.name}
                                        className="absolute w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="text-foreground text-xs md:text-sm font-medium line-clamp-1 hover:underline hover:text-primary">
                                        {item?.name}
                                    </h4>
                                    <div className="text-foreground flex items-center gap-1.5 text-xs md:text-sm mb-0.5">
                                        {"Qty"}: {item?.quantity} | {"Price"}:{" "}
                                        {item?.mainPrice}
                                        {item?.variant && (
                                            <>
                                                {" "}
                                                |{" "}
                                                <span className="text-[10px] font-medium rounded text-primary border border-primary px-1">
                                                    {"Variant"}:{item?.variant}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <QuantityCampaign item={item} />
                                </div>
                            </div>

                            <div>
                                <RemoveButton
                                    item={item}
                                    setSelectedShipping={setSelectedShipping}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                            <span className="text-2xl font-bold">!</span>
                        </div>
                        <div className="flex flex-col items-center text-foreground text-sm md:text-base">
                            <span className="font-medium">No Items</span>
                            <span>Add items to cart</span>
                        </div>
                    </div>
                </div>
            )}

            {isActiveCoupon && <Coupon couponCode={cartSummary?.coupon_code} />}

            <div className="space-y-1 md:space-y-3">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Sub Total:</span>
                    <span className="font-medium">
                        {cartSummary?.sub_total || "৳00.00"}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">
                        Shipping Cost:
                    </span>
                    <span className="font-medium">
                        {cartSummary?.shipping_cost || "৳00.00"}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount:</span>
                    <span className="text-green-600 font-semibold">
                        {cartSummary?.discount || "৳00.00"}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-muted-foreground">
                        Estimated sales tax:
                    </span>
                    <span className="font-medium">
                        {cartSummary?.tax || "৳00.00"}
                    </span>
                </div>
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span>{cartSummary?.grand_total || "৳00.00"}</span>
            </div>

            {children}
        </Card>
    );
};

interface BtnProps {
    item: StateSyncType;
    setSelectedShipping: (id: string) => void;
}

const RemoveButton = ({ item, setSelectedShipping }: BtnProps) => {
    const campaign = useSelector(
        (state: RootStateType) => state.campaign?.items,
    );
    const { removeLoading, fnRemoveCart } = useCampaignRemoveCart(item);

    const handleClick = () => {
        if (campaign?.length === 1) {
            setSelectedShipping("");
        }

        fnRemoveCart();
    };

    return (
        <Button
            onClick={handleClick}
            disabled={removeLoading}
            variant="ghost"
            size="sm"
        >
            <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
    );
};
