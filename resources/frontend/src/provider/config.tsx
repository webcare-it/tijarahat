import { useEffect } from "react";
import { useGetConfig } from "@/api/queries/useGetConfig";
import { ConfigContext, type ConfigType } from "@/hooks/useConfig";
import { getConfig } from "@/helper";
import { updatePrimaryColor, updatePrimaryForeground } from "@/lib/chroma";
import { IpErrorPage } from "@/pages/utils-pages/ip-error";
import { RootPageLoading } from "@/components/layout/root-loading";

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
    const { data, isLoading, error } = useGetConfig();

    const config = (data?.data as ConfigType[]) || [];
    const primaryColor = getConfig(config, "base_color")?.value;
    const secondaryColor = getConfig(config, "base_hov_color")?.value;

    useEffect(() => {
        if (primaryColor && typeof primaryColor === "string") {
            updatePrimaryColor(primaryColor);
        }
        if (secondaryColor && typeof secondaryColor === "string") {
            updatePrimaryForeground(secondaryColor);
        }
    }, [primaryColor, secondaryColor]);

    const hasNetworkError =
        error &&
        typeof error === "object" &&
        "code" in error &&
        (error as { code: string })?.code === "ERR_NETWORK";

    if (isLoading) {
        return <RootPageLoading />;
    }
    if (hasNetworkError) {
        return <IpErrorPage />;
    }

    return (
        <ConfigContext.Provider value={config}>
            {children}
        </ConfigContext.Provider>
    );
};
