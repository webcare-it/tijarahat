import { QueryClient } from "@tanstack/react-query";

export const queryOptions = {
  staleTime: 30 * 60 * 1000,
  gcTime: 24 * 60 * 60 * 1000,
  refetchOnWindowFocus: false,
  retry: 3,
  refetchOnReconnect: false,
  refetchOnMount: false,
};

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        ...queryOptions,
      },
    },
  });
};

export const queryClient = makeQueryClient();

export const revalidateQueryFn = (queryKey: string) => {
  queryClient.invalidateQueries({ queryKey: [queryKey] });
};
