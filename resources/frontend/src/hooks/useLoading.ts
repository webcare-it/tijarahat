import { useState, useCallback } from "react";

export const useLoading = () => {
  const [loadingStates, setLoadingStates] = useState<{
    [key: string | number]: boolean;
  }>({});

  const stopLoadingFn = useCallback(
    async (key: string | number, action?: () => Promise<void>) => {
      setLoadingStates((prev) => ({ ...prev, [key]: true }));

      try {
        await Promise.all([
          action ? action() : Promise.resolve(),
          new Promise((resolve) => setTimeout(resolve, 500)),
        ]);
        return true;
      } finally {
        setLoadingStates((prev) => ({ ...prev, [key]: false }));
      }
    },
    []
  );

  const startLoadingFn = useCallback(
    (key: string | number) => !!loadingStates[key],
    [loadingStates]
  );

  return { startLoadingFn, stopLoadingFn };
};
