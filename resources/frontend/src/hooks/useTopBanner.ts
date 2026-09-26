import { createContext, useContext } from "react";

interface TopBannerContextType {
  showTopBanner: boolean;
  setShowTopBanner: (show: boolean) => void;
}

export const TopBannerContext = createContext<TopBannerContextType>({
  showTopBanner: false,
  setShowTopBanner: () => {},
});

export const useTopBannerVisibility = () => useContext(TopBannerContext);
