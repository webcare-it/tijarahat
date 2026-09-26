import type { RootStateType } from "@/redux/store";
import type { ProductType, StateSyncType } from "@/type";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlistFn, clearWishlistFn, removeFromWishlistFn, setWishlistItemsFn } from "@/redux/slice/wishlistSlice";
import { toast } from "react-hot-toast";
import { extractNumericValue, getUserId, isAuthenticated, isExistingItem } from "@/helper";
import { useLoading } from "@/hooks/useLoading";
import { useAddToWishlistMutation, useRemoveWishlistMutation } from "@/api/mutations/useWishlist";
import { useNavigate } from "react-router-dom";
import { useGetWishlistQuery } from "@/api/queries/useGetWishlist";
import { useEffect } from "react";
import { revalidateQueryFn } from "@/lib/query-client";
import { apiErrorHandler } from "@/api/utils/error";

export const useAddToWishlist = (item: ProductType) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { startLoadingFn, stopLoadingFn } = useLoading();
  const { mutate, isPending } = useAddToWishlistMutation();
  const wishlist = useSelector((state: RootStateType) => state.wishlist);

  const fnAddToWishlist = () => {
    if (!isAuthenticated()) {
      toast.error("Please signin to add an item to your wishlist");
      navigate("/signin");
      return;
    }

    const existingItem = isExistingItem(wishlist?.items, item);

    if (existingItem) {
      toast.error("Item already in wishlist");
      return;
    }

    const data: StateSyncType = {
      id: item?.id,
      productId: item?.productId || item?.id,
      name: item?.name,
      image: item?.thumbnail_image,
      category_name: item?.category_name,
      mainPrice: item?.calculable_price,
      showPrice: item?.main_price,
      variant: item?.variant || null,
      quantity: 1,
    };

    const formData = new FormData();
    formData.append("product_id", item?.productId?.toString() || item?.id.toString());
    formData.append("variant", item?.variant || "");
    if (getUserId()) {
      formData.append("user_id", getUserId() as string);
    }

    mutate(formData, {
      onSuccess: (res) => {
        if (res?.result === true) {
          dispatch(addToWishlistFn(data));
          revalidateQueryFn("get_wishlist");
          toast.success(res?.message || "Item added to wishlist");
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

  const addLoading = startLoadingFn(item?.id) || isPending;

  return { addLoading, fnAddToWishlist };
};

export const useRemoveFromWishlist = (item: ProductType | StateSyncType) => {
  const dispatch = useDispatch();
  const { mutate } = useRemoveWishlistMutation();
  const { startLoadingFn, stopLoadingFn } = useLoading();

  const wishlist = useSelector((state: RootStateType) => state.wishlist);
  const isWishListed = isExistingItem(wishlist?.items, item as ProductType);

  const fnRemoveWishlist = () => {
    if (!isAuthenticated()) {
      toast.error("Please signin to remove an item from your wishlist");
      return;
    }

    if (isWishListed) {
      const id = isWishListed?.id;
      mutate(
        { id: id as number | string },
        {
          onSuccess: (res) => {
            if (res?.result === true) {
              stopLoadingFn(item?.id);
              toast.success(res?.message || "Item removed from wishlist");

              dispatch(removeFromWishlistFn(id as number));
              revalidateQueryFn("get_wishlist");
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

  const removeLoading = startLoadingFn(item?.id) || false;

  return { removeLoading, fnRemoveWishlist };
};

export const useGetWishlist = () => {
  const dispatch = useDispatch();

  const { data, isLoading } = useGetWishlistQuery();

  useEffect(() => {
    if (isLoading) return;

    if (data && data?.data && Array.isArray(data?.data) && data?.data?.length > 0) {
      const wishlist = data?.data?.map((item) => {
        const result: StateSyncType = {
          id: item?.id,
          productId: item?.product?.id,
          name: item?.product?.name,
          image: item?.product?.thumbnail_image,
          category_name: item?.product?.category_name,
          mainPrice: extractNumericValue(item?.product?.base_price),
          showPrice: item?.product?.main_price,
          variant: item?.product?.variation,
          quantity: item?.quantity,
        };
        return result;
      });

      dispatch(setWishlistItemsFn(wishlist as StateSyncType[]));
    } else if (data !== undefined && data !== null) {
      dispatch(clearWishlistFn());
    }
  }, [data, isLoading, dispatch]);
};
