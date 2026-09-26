export type OrderStatusType =
  | "place_order"
  | "processing"
  | "quality_check"
  | "on_the_way"
  | "delivered"
  | "cancelled";

export interface OrderStepType {
  id: OrderStatusType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface OrderItemType {
  id: number;
  product_name: string;
  product_id: number;
  product_thumbnail_image: string;
  quantity: number;
  price: string;
  variation?: string;
}

export interface OrderDataType {
  order_code: string;
  order_date: string;
  order_status: OrderStatusType;
  order_items: OrderItemType[];
  shipping_cost: string;
  grand_total: string;
  sub_total: string;
  payment_method: string;
  shipping_address: {
    name: string;
    phone: string;
    address: string;
  };
}

export interface ApiDeliveryTimeline {
  status: string;
  label: string;
  completed: boolean;
  active: boolean;
}

export interface ApiOrderDetailType {
  id: number;
  product_id: number;
  product_name: string;
  product_thumbnail_image: string;
  variation: string | null;
  quantity: number;
  price: string;
  shipping_cost?: string;
  delivery_status: string;
}

export interface ApiShippingAddressType {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface ApiOrderResponseType {
  id: number;
  subtotal: string;
  shipping_cost: string;
  code: string;
  date: string;
  payment_type: string;
  payment_status: string;
  delivery_status: string;
  delivery_timeline: ApiDeliveryTimeline[];
  tracking_code: string | null;
  grand_total: string;
  shipping_address: ApiShippingAddressType;
  order_details: ApiOrderDetailType[];
}

const mapDeliveryStatusToOrderStatus = (
  timeline: ApiDeliveryTimeline[]
): OrderStatusType => {
  const activeStatus = timeline?.find((item) => item?.active);

  if (!activeStatus) return "place_order";

  const statusMap: Record<string, OrderStatusType> = {
    pending: "place_order",
    confirmed: "processing",
    picked_up: "quality_check",
    on_the_way: "on_the_way",
    delivered: "delivered",
    cancelled: "cancelled",
  };

  return statusMap[activeStatus?.status] || "place_order";
};

export const transformApiResponseToOrderData = (
  apiData: ApiOrderResponseType
): OrderDataType => {
  const order_items: OrderItemType[] = apiData?.order_details?.map((item) => ({
    id: item?.id,
    product_name: item?.product_name || "",
    product_id: item?.product_id,
    product_thumbnail_image: item?.product_thumbnail_image || "",
    quantity: item?.quantity || 0,
    price: item?.price || "0",
    variation: item?.variation || "",
  }));

  const order_status = mapDeliveryStatusToOrderStatus(
    apiData?.delivery_timeline || []
  );

  return {
    order_code: apiData?.code,
    order_date: apiData?.date,
    order_status,
    order_items,
    sub_total: apiData?.subtotal || "",
    shipping_cost: apiData?.shipping_cost || "",
    grand_total: apiData?.grand_total || "",
    payment_method: apiData?.payment_type,
    shipping_address: {
      name: apiData?.shipping_address?.name,
      phone: apiData?.shipping_address?.phone,
      address: apiData?.shipping_address?.address,
    },
  };
};
