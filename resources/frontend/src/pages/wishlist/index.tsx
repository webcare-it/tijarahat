import { BaseLayout } from "@/components/layout/base-layout";
import {
  HomeSectionTitle,
  SectionTitle,
} from "@/components/common/section-title";
import { SeoWrapper } from "@/components/common/seo-wrapper";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { WishlistItems } from "./items";
import { BreadcrumbWrapper } from "@/components/common/breadcrumb-wrapper";

export const WishlistPublicPage = () => {
  return (
    <>
      <SeoWrapper title={"My Wishlist"} />

      <BaseLayout>
        <section className="mb-10 md:mb-20 mt-10">
          <HomeSectionTitle title="My Wishlist" />
          <WishlistItems />
        </section>
      </BaseLayout>
    </>
  );
};

export const WishlistPrivatePage = () => {
  return (
    <>
      <SeoWrapper title={"My Wishlist"} />
      <DashboardLayout>
        <div className="mx-4 md:mx-0 mb-4">
          <BreadcrumbWrapper
            type="dashboard"
            items={[{ title: "My Wishlist" }]}
          />
        </div>
        <SectionTitle title={"My Wishlist"} />
        <WishlistItems />
      </DashboardLayout>
    </>
  );
};
