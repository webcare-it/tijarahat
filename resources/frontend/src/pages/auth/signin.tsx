import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SeoWrapper } from "@/components/common/seo-wrapper";
import { SignInForm } from "./component/form";
import { AuthDescription } from "./component/description";
import { BaseLayout } from "@/components/layout/base-layout";

export const SignInPage = () => {
  return (
    <>
      <SeoWrapper title="Sign in" />
      <BaseLayout isShowMegaMenu={false}>
        <section className="flex justify-center items-center my-10">
          <div className="flex w-full max-w-lg flex-col gap-6">
            <div className={cn("flex flex-col gap-4 md:gap-6")}>
              <Card className="p-4 mx-4 md:mx-0">
                <CardHeader className="flex gap-2 flex-col items-center justify-center">
                  <div className="text-center mt-4">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>Sign in to your account</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="px-4 md:px-6">
                  <SignInForm />
                </CardContent>
              </Card>
              <AuthDescription />
            </div>
          </div>
        </section>
      </BaseLayout>
    </>
  );
};
