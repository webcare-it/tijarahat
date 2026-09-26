import { SeoWrapper } from "@/components/common/seo-wrapper";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SectionTitle } from "@/components/common/section-title";
import { BreadcrumbWrapper } from "@/components/common/breadcrumb-wrapper";
import { useGetUserQuery } from "@/api/queries/useUser";
import { ProfileInfo } from "./info";
import { ProfileSecurity } from "./security";

export const ProfilePage = () => {
  const { data } = useGetUserQuery();

  return (
    <>
      <SeoWrapper title={"My Profile"} />
      <DashboardLayout>
        <section className="space-y-4">
          <div className="mx-4 md:mx-0">
            <BreadcrumbWrapper
              type="dashboard"
              items={[{ title: "My Profile" }]}
            />
          </div>
          <SectionTitle title={"My Profile"} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-4 md:mx-0">
            <ProfileInfo user={data?.user} />
            <ProfileSecurity user={data?.user} />
          </div>
        </section>
      </DashboardLayout>
    </>
  );
};
