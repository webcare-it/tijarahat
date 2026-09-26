import type { RootStateType } from "@/redux/store";
import type { ProductType, StateSyncType } from "@/type";
import { useDispatch, useSelector } from "react-redux";
import { addToCartFn, removeFromCartFn, setCartItemsFn, incrementFn, decrementFn, clearCartFn } from "@/redux/slice/cartSlice";
import { toast } from "react-hot-toast";
import { isExistingItem, getUserId, getGuestUserId } from "@/helper";
import { useLoading } from "@/hooks/useLoading";
import { useAddToCartMutation, useRemoveCartMutation, useUpdateCartMutation } from "@/api/mutations/useCart";
import { useEffect } from "react";
import { useGetCartQuery } from "@/api/queries/useGetCart";
import { apiErrorHandler } from "@/api/utils/error";
import { revalidateQueryFn } from "@/lib/query-client";
import { useNavigate } from "react-router-dom";
import type { ItemTrackerType } from "@/hooks/useGtmTracker";
import { useGtmTracker } from "@/hooks/useGtmTracker";

export const useAddToCart = (
  item: ProductType,
  quantity: number = 1,
  variant: string | null = null,
  productId?: string | number | null,
  onShowModal?: (type: string, title?: string, size?: string, data?: unknown) => void,
) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mutate } = useAddToCartMutation();
  const { addToCartTracker } = useGtmTracker();
  const { startLoadingFn, stopLoadingFn } = useLoading();

  const fnAddToCart = (isCheckout?: boolean) => {
    const data: StateSyncType = {
      id: item?.id,
      productId: productId || item?.id,
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

    const formData = new FormData();
    formData.append("id", productId?.toString() || item?.id.toString());
    formData.append("quantity", quantity.toString());
    formData.append("variant", variant || "");
    if (getUserId()) {
      formData.append("user_id", getUserId() as string);
    } else {
      formData.append("temp_user_id", getGuestUserId() as string);
    }

    mutate(formData, {
      onSuccess: (res) => {
        if (res?.result === true) {
          toast.success(res?.message || "Item added to cart");
          addToCartTracker(trackerData);
          dispatch(addToCartFn(data));
          stopLoadingFn(item?.id);
          revalidateQueryFn("get_cart");
          if (isCheckout) {
            navigate("/checkout");
          }
          if (onShowModal) {
            onShowModal("SUCCESS", "Item added to cart", "w-md");
          }
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

export const useRemoveFromCart = (item: ProductType | StateSyncType) => {
  const dispatch = useDispatch();
  const { mutate, isPending } = useRemoveCartMutation();
  const { startLoadingFn, stopLoadingFn } = useLoading();
  const cart = useSelector((state: RootStateType) => state.cart);
  const isExisting = isExistingItem(cart?.items, item as ProductType);

  const fnRemoveCart = () => {
    if (isExisting) {
      const id = isExisting?.id;

      mutate(
        { id: id as number | string },
        {
          onSuccess: (res) => {
            if (res?.result === true) {
              dispatch(removeFromCartFn(id as number));
              revalidateQueryFn("get_cart");
              revalidateQueryFn("get_cart_summary");

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
        },
      );
    }
  };

  const removeLoading = startLoadingFn(item?.id) || isPending;

  return { removeLoading, fnRemoveCart };
};

export const useIncrementCart = (item: ProductType | StateSyncType) => {
  const dispatch = useDispatch();
  const { mutate } = useUpdateCartMutation();
  const { startLoadingFn, stopLoadingFn } = useLoading();
  const cart = useSelector((state: RootStateType) => state.cart);

  const fnIncrementCart = () => {
    const existingItem = isExistingItem(cart?.items, item as ProductType);

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
          dispatch(incrementFn(existingItem.id as number));
          toast.success(res?.message || "Item incremented in cart");
          revalidateQueryFn("get_cart");
          revalidateQueryFn("get_cart_summary");
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

export const useDecrementCart = (item: ProductType | StateSyncType) => {
  const dispatch = useDispatch();
  const { mutate } = useUpdateCartMutation();
  const { startLoadingFn, stopLoadingFn } = useLoading();
  const cart = useSelector((state: RootStateType) => state.cart);

  const fnDecrementCart = () => {
    const existingItem = isExistingItem(cart?.items, item as ProductType);

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
          dispatch(decrementFn(existingItem.id as number));
          toast.success(res?.message || "Item decremented in cart");
          revalidateQueryFn("get_cart");
          revalidateQueryFn("get_cart_summary");
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

export const useGetCart = () => {
  const dispatch = useDispatch();

  const { data, isLoading } = useGetCartQuery();

  useEffect(() => {
    if (isLoading) return;

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

      dispatch(setCartItemsFn(cart as StateSyncType[]));
    } else if (data !== undefined && data !== null) {
      dispatch(clearCartFn());
    }
  }, [data, isLoading, dispatch]);
};
