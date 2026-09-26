import { Helmet } from "react-helmet-async";
import type { ProductDetailsType } from "@/type";
import {
  getConfig,
  getImageUrl,
  htmlToPlainText,
  truncateText,
} from "@/helper";
import { useConfig } from "@/hooks/useConfig";
import { useGtmTracker, type ItemTrackerType } from "@/hooks/useGtmTracker";
import { useEffect, useRef } from "react";

export const ProductDetailsSeo = ({
  product,
}: {
  product: ProductDetailsType;
}) => {
  const config = useConfig();
  const hasTracked = useRef(false);
  const { viewItemTracker } = useGtmTracker();
  const siteName = getConfig(config, "website_name")?.value as string;

  useEffect(() => {
    if (product && product?.id && !hasTracked.current) {
      const trackerData: ItemTrackerType = {
        item_id: product?.id.toString(),
        item_name: product?.name,
        item_price: product?.calculable_price || 0,
        item_quantity: 1,
        item_variant: product?.variants?.[0]?.variant_name || null,
        item_brand: product?.brand?.name || null,
        item_category: product?.category_name,
      };

      viewItemTracker(trackerData);

      hasTracked.current = true;
    }
  }, [product, viewItemTracker]);

  return (
    <Helmet>
      <title>
        {product?.name} - {siteName}
      </title>
      <meta
        name="description"
        content={truncateText(htmlToPlainText(product?.description))}
      />
      <meta name="keywords" content={product?.tags?.join(", ")} />
      <meta
        property="og:image"
        content={getImageUrl(product?.thumbnail_image)}
      />
      <meta property="og:title" content={product?.name} />
      <meta
        property="og:description"
        content={truncateText(htmlToPlainText(product?.description))}
      />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:type" content="product" />
      <meta property="og:site_name" content={product?.shop_name} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="bn_BD" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:type" content="image/jpg" />
      <meta property="og:image:type" content="image/webp" />
      <meta property="og:image:alt" content={product?.name} />
      <meta
        property="og:image:url"
        content={getImageUrl(product?.thumbnail_image)}
      />
      <meta
        property="og:image:secure_url"
        content={getImageUrl(product?.thumbnail_image)}
      />
    </Helmet>
  );
};
