import { createContext, useContext } from "react";

export interface CookieContextType {
  showCookieBanner: boolean;
  acceptCookies: () => void;
  declineCookies: () => void;
  cookiePreferences: {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
  };
  updateCookiePreferences: (
    preferences: Partial<CookieContextType["cookiePreferences"]>
  ) => void;
}

export const CookieContext = createContext<CookieContextType | undefined>(
  undefined
);

export const useCookie = () => {
  const context = useContext(CookieContext);
  if (!context) {
    throw new Error("useCookie must be used within a CookieProvider");
  }
  return context;
};
