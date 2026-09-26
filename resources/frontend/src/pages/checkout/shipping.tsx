import { useMemo, useRef } from "react";
import { useShippingCost } from "@/api/queries/useShipping";
import { useShippingCostMutation } from "@/api/mutations/useShipping";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/common/skeleton";
import { cn } from "@/lib/utils";
import type { ShippingType } from "@/type";
import { Truck } from "lucide-react";
import { toast } from "react-hot-toast";
import { getConfig, getGuestUserId, getUserId } from "@/helper";
import { revalidateQueryFn } from "@/lib/query-client";
import { apiErrorHandler } from "@/api/utils/error";
import { useConfig } from "@/hooks/useConfig";

interface Props {
    selectedShipping: string;
    setSelectedShipping: (id: string) => void;
}

export const ShippingCost = ({
    selectedShipping,
    setSelectedShipping,
}: Props) => {
    const isProcessingRef = useRef(false);
    const { data, isLoading } = useShippingCost();
    const { mutate, isPending } = useShippingCostMutation();

    const shippingOption = useMemo(
        () => (data?.data as ShippingType[]) || [],
        [data?.data],
    );

    const handleShippingSelect = (value: string) => {
        if (isProcessingRef.current || isPending) {
            return;
        }

        if (selectedShipping === value) {
            return;
        }

        const shipping = shippingOption?.find(
            (item: ShippingType) => item?.id?.toString() === value,
        );

        if (shipping) {
            isProcessingRef.current = true;

            const formData = new FormData();
            formData.append(
                "user_id",
                (getUserId() as string) || (getGuestUserId() as string),
            );
            formData.append("shipping_cost", shipping.amount.toString());

            mutate(formData, {
                onSuccess: (response) => {
                    isProcessingRef.current = false;
                    if (response?.result) {
                        setSelectedShipping(shipping?.id?.toString());
                        revalidateQueryFn("get_cart_summary");
                        revalidateQueryFn("get_campaign_summary");
                        toast.success(
                            response?.message ||
                                "Shipping option selected successfully",
                        );
                    } else {
                        toast.error(
                            response?.message ||
                                "Failed to select shipping option",
                        );
                    }
                },
                onError: (error) => {
                    isProcessingRef.current = false;
                    return apiErrorHandler(error);
                },
            });
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Skeleton className="h-6 w-32" />
                </div>
                <div className="space-y-3">
                    {[1, 2].map((i) => (
                        <Card key={i} className="p-4">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-4 w-4 rounded-full" />
                                <Skeleton className="h-5 w-5" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                                <Skeleton className="h-4 w-12" />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4 mt-4 md:mt-6">
                <Truck className="md:size-6 size-5 text-primary" />
                <h3 className="text-lg font-semibold">
                    {"Select Shipping Method"}
                </h3>
            </div>

            {isLoading ? (
                <div className="flex items-center gap-4 flex-wrap">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 w-full rounded-lg " />
                    ))}
                </div>
            ) : (
                <RadioGroup
                    value={selectedShipping}
                    onValueChange={handleShippingSelect}
                    className="flex items-center gap-4 flex-wrap"
                    disabled={isPending || isLoading}
                >
                    {shippingOption?.length > 0 ? (
                        shippingOption?.map((shipping: ShippingType) => (
                            <Card
                                key={shipping?.id}
                                onClick={() =>
                                    handleShippingSelect(
                                        shipping?.id?.toString(),
                                    )
                                }
                                className={cn(
                                    "cursor-pointer py-2 md:py-3 transition-all duration-200 hover:shadow-md flex-1 min-w-xs",
                                    selectedShipping?.toString() ===
                                        shipping?.id.toString()
                                        ? "ring-2 ring-primary bg-primary/5"
                                        : "hover:bg-gray-50",
                                    isPending &&
                                        "opacity-50 cursor-not-allowed",
                                )}
                            >
                                <CardContent className="px-3 md:px-4">
                                    <div className="flex items-center gap-4">
                                        <RadioGroupItem
                                            value={shipping?.id?.toString()}
                                            className="flex-shrink-0 md:size-6 size-5 cursor-pointer"
                                        />

                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="flex items-center gap-2 md:gap-3">
                                                <h4 className="text-sm md:text-base font-medium text-foreground">
                                                    {shipping?.name}
                                                </h4>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-base md:text-lg font-semibold text-foreground">
                                                ৳{shipping?.amount}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center text-muted-foreground">
                            No shipping options found
                        </div>
                    )}
                </RadioGroup>
            )}
        </div>
    );
};

export const ShippingCostForDetails = () => {
    const config = useConfig();
    const { data, isLoading } = useShippingCost();

    const phone = getConfig(config, "contact_phone")?.value as string;
    const bkashNumber = getConfig(config, "bkash_number")?.value as string;

    const shippingOption = useMemo(
        () => (data?.data as ShippingType[]) || [],
        [data?.data],
    );

    if (isLoading) {
        return (
            <ul className="space-y-4 bg-accent rounded-lg p-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <li
                        key={i}
                        className="flex items-center justify-between gap-4 border-b pb-1.5 md:pb-2"
                    >
                        <Skeleton className="h-4 w-32" />
                        <div className="text-base text-foreground font-semibold">
                            <Skeleton className="h-4 w-20" />
                        </div>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <ul className="space-y-4 bg-accent rounded-lg p-4">
            {shippingOption?.map((shipping: ShippingType) => (
                <li
                    key={shipping?.id}
                    className="flex items-center justify-between gap-4 border-b pb-1.5 md:pb-2"
                >
                    <div className="text-sm font-medium text-foreground">
                        {shipping?.name}
                    </div>
                    <div className="text-base text-foreground font-semibold">
                        ৳{shipping?.amount}
                    </div>
                </li>
            ))}
            <li className="flex items-center justify-between gap-4">
                <div className="text-sm font-medium text-foreground">
                    Bkash Number :
                </div>
                <div className="text-base text-foreground font-semibold">
                    {bkashNumber || phone}
                </div>
            </li>
        </ul>
    );
};
