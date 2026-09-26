import { getLocalStorage } from "@/helper";

export interface ItemTrackerType {
  item_id: string;
  item_name: string;
  item_price: number;
  item_quantity: number;
  item_variant?: string | null;
  index?: number;
  coupon?: string | null;
  item_brand?: string | null;
  item_category?: string | null;
}

export interface PurchaseTrackerType {
  transaction_id: string;
  value: number;
  shipping?: number;
  coupon?: string;
  tax?: number;
  customer_type: "new" | "returning";
  items: ItemTrackerType[];
}

export interface PersonalDataType {
  ip_address: string;
  email: string;
  phone: string;
  name: string;
  address: string;
}

export interface ViewCartTrackerType {
  value: number;

  items: ItemTrackerType[];
}

export const useGtmTracker = () => {
  const addToCartTracker = (data: ItemTrackerType) => {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: "add_to_cart",
        ecommerce: {
          currency: "BDT",
          value: data?.item_price * data?.item_quantity || 1,
          items: [
            {
              item_id: data?.item_id,
              item_name: data?.item_name,
              price: data?.item_price,
              quantity: data?.item_quantity,
              item_variant: data?.item_variant || undefined,
            },
          ],
        },
      });
    }
  };

  const startCheckoutTracker = (data: PurchaseTrackerType) => {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: "begin_checkout",
        ecommerce: {
          currency: "BDT",
          value: data?.value,
          items: data?.items,
        },
      });
    }
  };

  const purchaseTracker = (
    data: PurchaseTrackerType,
    info: PersonalDataType
  ) => {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: "purchase",
        ecommerce: {
          currency: "BDT",
          customer_type: data?.customer_type || "new",
          coupon: getLocalStorage("coupon_code") || "",
          value: data?.value,
          shipping: data?.shipping || 0,
          items: data?.items,
          transaction_id: data?.transaction_id,
        },
        personal_data: info,
      });
    }
  };

  const viewCartTracker = (data: ViewCartTrackerType) => {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: "view_cart",
        ecommerce: {
          currency: "BDT",
          value: data?.value,
          items: data?.items,
        },
      });
    }
  };

  const viewItemTracker = (data: ItemTrackerType) => {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: "view_item",
        ecommerce: {
          currency: "BDT",
          value: data?.item_price * data?.item_quantity || 1,
          items: [
            {
              item_id: data?.item_id,
              item_name: data?.item_name,
              price: data?.item_price,
              quantity: data?.item_quantity,
              item_variant: data?.item_variant || undefined,
            },
          ],
        },
      });
    }
  };

  return {
    addToCartTracker,
    startCheckoutTracker,
    purchaseTracker,
    viewItemTracker,
    viewCartTracker,
  };
};
