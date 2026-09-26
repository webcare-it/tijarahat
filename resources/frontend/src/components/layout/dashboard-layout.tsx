import { ProtectRoute } from "@/provider/protect";
import { BaseLayout } from "./base-layout";
import { ProfileCard } from "../card/profile";

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ProtectRoute>
      <BaseLayout isShowMegaMenu={false}>
        <section className="mb-10 md:mb-20 mt-10 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          <div className="hidden md:block col-span-1">
            <div className="sticky top-20">
              <ProfileCard className="rounded-lg shadow-lg" />
            </div>
          </div>
          <div className="md:col-span-3">{children}</div>
        </section>
      </BaseLayout>
    </ProtectRoute>
  );
};
