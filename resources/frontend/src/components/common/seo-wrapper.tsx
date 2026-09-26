import { getConfig } from "@/helper";
import { useConfig } from "@/hooks/useConfig";
import { Helmet } from "react-helmet-async";

export const SeoWrapper = ({ title }: { title: string }) => {
  const config = useConfig();
  const siteName = getConfig(config, "website_name")?.value as string;
  return (
    <Helmet>
      <title>
        {title} - {siteName}
      </title>
    </Helmet>
  );
};
