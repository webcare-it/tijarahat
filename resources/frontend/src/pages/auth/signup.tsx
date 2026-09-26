import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SeoWrapper } from "@/components/common/seo-wrapper";
import { SignUpForm } from "./component/form";
import { AuthDescription } from "./component/description";
import { BaseLayout } from "@/components/layout/base-layout";

export const SignUpPage = () => {
  return (
    <>
      <SeoWrapper title="Sign up" />
      <BaseLayout isShowMegaMenu={false}>
        <section className="flex justify-center items-center my-10">
          <div className="flex w-full max-w-lg flex-col gap-6">
            <div className={cn("flex flex-col gap-6")}>
              <Card className="mx-4 md:mx-0">
                <CardHeader className="flex gap-2 flex-col items-center justify-center">
                  <div className="text-center mt-4">
                    <CardTitle className="text-xl">Welcome</CardTitle>
                    <CardDescription>Sign up to your account</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <SignUpForm />
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
