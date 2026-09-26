import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/common/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonItemProps {
  width?: string;
  height?: string;
  rounded?: string;
  className?: string;
}

export const OrderTrackSkeleton = ({
  width,
  height,
  rounded = "rounded-lg",
  className,
}: SkeletonItemProps = {}) => {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Card className="shadow-lg">
        <CardContent className="p-4 md:p-6">
          <Skeleton
            width={width}
            height={height}
            rounded={rounded}
            className="w-32 h-6 mb-6"
          />

          <div className="hidden md:block">
            <div className="flex justify-between items-center">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <Skeleton
                    width="80px"
                    height="80px"
                    rounded="rounded-full"
                    className="w-20 h-20"
                  />
                  <Skeleton
                    width="60px"
                    height="16px"
                    rounded="rounded-md"
                    className="w-15 h-4"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="md:hidden space-y-6 pl-10">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton
                  width="64px"
                  height="64px"
                  rounded="rounded-full"
                  className="w-16 h-16"
                />
                <Skeleton
                  width="100px"
                  height="20px"
                  rounded="rounded-md"
                  className="w-24 h-5 flex-1"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg lg:col-span-2">
          <CardContent className="p-4 md:p-6">
            <Skeleton
              width={width}
              height={height}
              rounded={rounded}
              className="w-30 h-6 mb-4"
            />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4 pb-4 border-b last:border-0">
                  <Skeleton
                    width="96px"
                    height="96px"
                    rounded="rounded-lg"
                    className="w-20 h-20 md:w-24 md:h-24"
                  />
                  <div className="flex-1 space-y-2">
                    <Skeleton
                      width="100%"
                      height="20px"
                      rounded="rounded-md"
                      className="w-full h-5"
                    />
                    <Skeleton
                      width="60px"
                      height="16px"
                      rounded="rounded-md"
                      className="w-15 h-4"
                    />
                    <div className="space-y-1">
                      <Skeleton
                        width="80px"
                        height="14px"
                        rounded="rounded-md"
                        className="w-20 h-3.5"
                      />
                      <Skeleton
                        width="70px"
                        height="14px"
                        rounded="rounded-md"
                        className="w-18 h-3.5"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg sticky top-4">
          <CardContent className="p-4 md:p-6">
            <Skeleton
              width={width}
              height={height}
              rounded={rounded}
              className="w-35 h-6 mb-4"
            />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton
                    width="80px"
                    height="14px"
                    rounded="rounded-md"
                    className="w-20 h-3.5"
                  />
                  <Skeleton
                    width="100px"
                    height="14px"
                    rounded="rounded-md"
                    className="w-25 h-3.5"
                  />
                </div>
              ))}
              <div className="pt-4 border-t space-y-2">
                <Skeleton
                  width="100%"
                  height="16px"
                  rounded="rounded-md"
                  className="w-full h-4"
                />
                <div className="flex justify-between pt-2">
                  <Skeleton
                    width="60px"
                    height="20px"
                    rounded="rounded-md"
                    className="w-15 h-5"
                  />
                  <Skeleton
                    width="80px"
                    height="20px"
                    rounded="rounded-md"
                    className="w-20 h-5"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
