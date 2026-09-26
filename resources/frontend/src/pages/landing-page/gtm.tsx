import { useGtmTracker, type ItemTrackerType } from "@/hooks/useGtmTracker";
import { useEffect, useRef } from "react";
import type { LandingPageType } from "./type";
import { Helmet } from "react-helmet-async";
import { useConfig } from "@/hooks/useConfig";
import {
  getConfig,
  getImageUrl,
  removeCurrencySymbol,
  truncateText,
} from "@/helper";

export const GtmSeo = ({ info }: { info: LandingPageType }) => {
  const config = useConfig();
  const hasTracked = useRef(false);
  const { viewItemTracker } = useGtmTracker();
  const siteName = getConfig(config, "website_name")?.value as string;
  useEffect(() => {
    if (info) {
      const price =
        removeCurrencySymbol(info?.regular_price as string) ||
        removeCurrencySymbol(info?.discount_price as string) ||
        0;
      const trackerData: ItemTrackerType = {
        item_id: info?.id.toString(),
        item_name: info?.name,
        item_price: price,
        item_quantity: 1,
        item_variant: info?.variants?.[0]?.variant_name || null,
        item_brand: null,
      };
      if (hasTracked.current) return;
      viewItemTracker(trackerData);
      hasTracked.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const img: string = info?.banner_image || info?.images?.[0]?.image;

  return (
    <Helmet>
      <title>
        {info?.name} - {siteName}
      </title>
      <meta
        name="description"
        content={truncateText(info?.sub_title || "")}
        title={info?.name}
      />

      <meta property="og:image" content={getImageUrl(img)} />
      <meta property="og:title" content={info?.title} />
      <meta
        property="og:description"
        content={truncateText(info?.sub_title || "")}
      />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:type" content="product" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="bn_BD" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:type" content="image/jpg" />
      <meta property="og:image:type" content="image/webp" />
      <meta property="og:image:alt" content={info?.title} />
      <meta property="og:image:url" content={getImageUrl(img)} />
      <meta property="og:image:secure_url" content={getImageUrl(img)} />
    </Helmet>
  );
};
