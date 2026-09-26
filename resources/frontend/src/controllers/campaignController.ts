import type { ProductType, StateSyncType } from "@/type";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { getGuestUserId, isExistingItem, setLocalStorage } from "@/helper";
import { useLoading } from "@/hooks/useLoading";
import {
  useAddToCartMutation,
  useRemoveCartMutation,
  useUpdateCartMutation,
} from "@/api/mutations/useCart";
import { apiErrorHandler } from "@/api/utils/error";
import { revalidateQueryFn } from "@/lib/query-client";
import type { ItemTrackerType } from "@/hooks/useGtmTracker";
import { useGtmTracker } from "@/hooks/useGtmTracker";
import {
  addToCartCampaign,
  decrementCampaign,
  incrementCampaign,
  removeFromCampaign,
  setCartItemsCampaign,
} from "@/redux/slice/campaignSlice";
import type { RootStateType } from "@/redux/store";
import { useGetCampaignCartQuery } from "@/api/queries/useGetCart";
import { useEffect } from "react";

export const useCampaignAddToCart = (
  item: ProductType,
  quantity: number = 1,
  variant: string | null = null
) => {
  const dispatch = useDispatch();
  const { mutate } = useAddToCartMutation();
  const { addToCartTracker } = useGtmTracker();
  const { startLoadingFn, stopLoadingFn } = useLoading();

  const campaign = useSelector((state: RootStateType) => state.campaign?.items);

  const fnAddToCart = (_variant?: string) => {
    const data: StateSyncType = {
      id: item?.id,
      productId: item?.id,
      name: item?.name,
      mainPrice: item?.calculable_price,
      image: item?.thumbnail_image,
      showPrice: item?.main_price,
      variant: variant,
      category_name: item?.category_name,
      quantity,
    };

    const trackerData: ItemTrackerType = {
      item_id: item?.id.toString(),
      item_name: item?.name,
      item_price: item?.calculable_price || 0,
      item_quantity: quantity || 1,
      item_category: item?.category_name,
      item_variant: variant,
    };
    const existingItem = campaign?.find((f: StateSyncType) => {
      const productMatch =
        (item?.productId && f?.productId === item?.productId) ||
        f?.productId === item?.id;
      if (variant) {
        return productMatch && f?.variant === variant;
      } else {
        return productMatch;
      }
    });

    const formData = new FormData();
    formData.append("id", item?.id.toString());
    formData.append("quantity", quantity.toString());
    formData.append("variant", _variant || variant || "");

    if (getGuestUserId()) {
      formData.append("temp_user_id", getGuestUserId() as string);
    } else {
      const id = crypto.randomUUID();
      setLocalStorage("guest_user_id", id as string);
      formData.append("temp_user_id", id as string);
    }

    mutate(formData, {
      onSuccess: (res) => {
        if (res?.result === true) {
          toast.success(res?.message || "Item added to cart");
          addToCartTracker(trackerData);
          if (existingItem) {
            dispatch(incrementCampaign(data.id as number));
          } else {
            dispatch(addToCartCampaign(data));
          }
          stopLoadingFn(item?.id);
          revalidateQueryFn("get_cart_campaign");
          revalidateQueryFn("get_campaign_summary");
        } else {
          toast.error(res?.message || "Something went wrong");
          stopLoadingFn(item?.id);
          return;
        }
      },
      onError: (error) => {
        stopLoadingFn(item?.id);
        return apiErrorHandler(error);
      },
    });
  };

  const isLoading = startLoadingFn(item?.id) || false;

  return { isLoading, fnAddToCart };
};

export const useCampaignRemoveCart = (item: ProductType | StateSyncType) => {
  const dispatch = useDispatch();
  const { mutate, isPending } = useRemoveCartMutation();
  const { startLoadingFn, stopLoadingFn } = useLoading();
  const camp = useSelector((state: RootStateType) => state.campaign);
  const isExisting = isExistingItem(camp?.items, item as ProductType);

  const fnRemoveCart = () => {
    if (isExisting) {
      const id = isExisting?.id;

      mutate(
        { id: id as number | string },
        {
          onSuccess: (res) => {
            if (res?.result === true) {
              dispatch(removeFromCampaign(id as number));
              revalidateQueryFn("get_cart_campaign");
              revalidateQueryFn("get_campaign_summary");

              toast.success("Item removed from cart");

              stopLoadingFn(item?.id);
            } else {
              toast.error(res?.message || "Something went wrong");
              stopLoadingFn(item?.id);
              return;
            }
          },
          onError: (error) => {
            stopLoadingFn(item?.id);
            return apiErrorHandler(error);
          },
        }
      );
    }
  };

  const removeLoading = startLoadingFn(item?.id) || isPending;

  return { removeLoading, fnRemoveCart };
};

export const useCampaignIncrementCart = (item: ProductType | StateSyncType) => {
  const dispatch = useDispatch();
  const { mutate } = useUpdateCartMutation();
  const { startLoadingFn, stopLoadingFn } = useLoading();
  const campaign = useSelector((state: RootStateType) => state.campaign?.items);

  const fnIncrementCart = () => {
    const existingItem = isExistingItem(campaign, item as ProductType);

    if (!existingItem) {
      toast.error("Item not found in cart");
      return;
    }

    const newQuantity = existingItem.quantity + 1;
    const formData = new FormData();
    formData.append("id", existingItem.id.toString());
    formData.append("quantity", newQuantity.toString());
    formData.append("variant", existingItem.variant || "");
    mutate(formData, {
      onSuccess: (res) => {
        if (res?.result === true) {
          dispatch(incrementCampaign(existingItem.id as number));
          toast.success(res?.message || "Item incremented in cart");
          revalidateQueryFn("get_cart_campaign");
          revalidateQueryFn("get_campaign_summary");
          stopLoadingFn(item?.id);
        } else {
          toast.error(res?.message || "Something went wrong");
          stopLoadingFn(item?.id);
          return;
        }
      },
      onError: (error) => {
        stopLoadingFn(item?.id);
        return apiErrorHandler(error);
      },
    });
  };

  const isLoading = startLoadingFn(item?.id);

  return { isLoading, fnIncrementCart };
};

export const useCampaignDecrementCart = (item: ProductType | StateSyncType) => {
  const dispatch = useDispatch();
  const { mutate } = useUpdateCartMutation();
  const { startLoadingFn, stopLoadingFn } = useLoading();
  const campaign = useSelector((state: RootStateType) => state.campaign?.items);

  const fnDecrementCart = () => {
    const existingItem = isExistingItem(campaign, item as ProductType);

    if (!existingItem) {
      toast.error("Item not found in cart");
      return;
    }

    if (existingItem.quantity <= 1) {
      toast.error("Cannot decrease quantity below 1");
      return;
    }

    const newQuantity = existingItem.quantity - 1;
    const formData = new FormData();
    formData.append("id", existingItem.id.toString());
    formData.append("quantity", newQuantity.toString());
    formData.append("variant", existingItem.variant || "");
    mutate(formData, {
      onSuccess: (res) => {
        if (res?.result === true) {
          dispatch(decrementCampaign(existingItem.id as number));
          toast.success(res?.message || "Item decremented in cart");
          revalidateQueryFn("get_cart_campaign");
          revalidateQueryFn("get_campaign_summary");
          stopLoadingFn(item?.id);
        } else {
          toast.error(res?.message || "Something went wrong");
          stopLoadingFn(item?.id);
          return;
        }
      },
      onError: (error) => {
        stopLoadingFn(item?.id);
        return apiErrorHandler(error);
      },
    });
  };

  const isLoading = startLoadingFn(item?.id);

  return { isLoading, fnDecrementCart };
};

export const useGetCampaignCart = () => {
  const dispatch = useDispatch();
  const { data, isLoading } = useGetCampaignCartQuery();

  useEffect(() => {
    if (!isLoading) {
      if (data && data?.length > 0 && data?.[0]?.cart_items?.length > 0) {
        const cart = data?.[0]?.cart_items?.map((item) => {
          const result: StateSyncType = {
            id: item?.id,
            productId: item?.product_id,
            name: item?.product_name,
            category_name: item?.category_name,
            image: item?.product_thumbnail_image,
            mainPrice: item?.price,
            showPrice: `${item?.currency_symbol} ${item?.price}`,
            variant: item?.variation,
            quantity: item?.quantity,
          };
          return result;
        });

        dispatch(setCartItemsCampaign(cart as StateSyncType[]));
      } else {
        dispatch(setCartItemsCampaign([]));
      }
    }
  }, [data, isLoading, dispatch]);
};
