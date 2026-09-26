import type { ProductDetailsType, VariantType } from "@/type";

interface ImageType {
  id: number;
  image: string;
}
interface ReviewImgType {
  id: number;
  review_image: string;
}

export interface LandingPageType {
  id: number;
  title: string;
  name: string;
  slug: string;
  sub_title: string;
  deadline: string;
  banner_image: string;
  video_id: string;
  feature_1: string;
  feature_2: string;
  feature_3: string;
  feature_4: string;
  feature_5: string;
  feature_6: string;
  feature_7: string;
  feature_8: string;
  description: string;
  short_description: string;
  copyright_text: string;
  regular_price: string | null;
  discount_price: string | null;
  products: { data: ProductDetailsType[] };
  variants: VariantType[];
  images: ImageType[];
  reviews: ReviewImgType[];
  created_at: string;
  updated_at: string;
}
