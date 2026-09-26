import { Skeleton } from "@/components/common/skeleton";

export const LandingSkeleton = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      <div className="px-4 sm:px-0 mb-8 py-6">
        <div className="flex justify-center items-center">
          <Skeleton className="h-16 w-sm rounded-lg" />
        </div>
      </div>

      <section className="container mx-auto px-4 sm:px-0 space-y-10 md:space-y-16">
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4 mx-auto rounded-lg" />
          <Skeleton className="h-8 w-1/2 mx-auto rounded-lg" />
        </div>

        <div className="space-y-6">
          <Skeleton className="aspect-video w-full rounded-xl" />
          <div className="flex justify-center">
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
        </div>

        <div className="space-y-6">
          <Skeleton className="h-10 w-1/3 mx-auto rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="aspect-[16/20] rounded-lg" />
            ))}
          </div>
          <div className="flex justify-center">
            <Skeleton className="h-12 w-52 rounded-full" />
          </div>
        </div>

        <div className="py-8 flex justify-center">
          <Skeleton className="h-52 max-w-xl rounded-xl" />
        </div>

        <div className="space-y-6">
          <Skeleton className="h-8 w-1/4 mx-auto rounded-lg" />
          <div className="flex justify-center gap-4">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="size-20 rounded-lg" />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Skeleton className="h-10 w-1/4 mx-auto rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="h-32 rounded-lg" />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Skeleton className="h-10 w-1/3 mx-auto rounded-lg" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="aspect-[16/24] rounded-lg" />
            ))}
          </div>
          <div className="flex justify-center">
            <Skeleton className="h-14 w-40 rounded-full" />
          </div>
        </div>

        <div className="space-y-6">
          <Skeleton className="h-12 w-1/2 mx-auto rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-lg border">
                <Skeleton className="h-24 w-24 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4 rounded" />
                  <Skeleton className="h-6 w-1/2 rounded" />
                  <Skeleton className="h-8 w-full rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Skeleton className="h-10 w-1/4 mx-auto rounded-lg" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4 p-6 rounded-lg border">
              <Skeleton className="h-8 w-1/2 rounded" />
              <Skeleton className="h-10 w-full rounded" />
              <Skeleton className="h-10 w-full rounded" />
              <Skeleton className="h-10 w-full rounded" />
              <Skeleton className="h-16 w-full rounded" />
              <Skeleton className="h-16 w-full rounded" />
            </div>
            <div className="space-y-4 p-6 rounded-lg border">
              <Skeleton className="h-8 w-1/2 rounded" />
              <div className="space-y-3">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex justify-between">
                    <Skeleton className="h-5 w-1/3 rounded" />
                    <Skeleton className="h-5 w-1/4 rounded" />
                  </div>
                ))}
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold">
                    <Skeleton className="h-6 w-1/4 rounded" />
                    <Skeleton className="h-6 w-1/5 rounded" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-12 w-full rounded-full" />
            </div>
          </div>
        </div>
      </section>

      <div className="h-20 bg-gray-900/10 mt-10 flex items-center justify-center">
        <Skeleton className="h-6 w-64 rounded" />
      </div>
    </div>
  );
};
