const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7;

export const getCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;

  const value = `; ${document.cookie}`;
  const parts = value?.split(`; ${name}=`);
  if (parts?.length === 2) {
    const cookieValue = parts?.pop()?.split(";")?.shift();
    return cookieValue;
  }
  return undefined;
};

export const setCookie = (
  name: string,
  value: string,
  maxAge: number = DEFAULT_MAX_AGE
): void => {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
};

export const removeCookie = (name: string): void => {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=; path=/; max-age=0`;
};
