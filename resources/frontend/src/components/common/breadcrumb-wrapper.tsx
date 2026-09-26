import { Link } from "react-router-dom";
import { Home, LayoutDashboard } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItem {
  title: string;
  path?: string;
  icon?: React.ReactNode;
}

interface Props {
  items: BreadcrumbItem[];
  className?: string;
  type?: "dashboard" | "home";
}

export const BreadcrumbWrapper = ({
  items,
  className,
  type = "home",
}: Props) => {
  const dashboard = {
    title: "My Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  };

  const home = {
    title: "Home",
    path: "/",
    icon: <Home className="h-4 w-4" />,
  };

  const allItems = [type === "dashboard" ? dashboard : home, ...items];

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {allItems?.map((item, index) => (
          <div key={index} className="flex items-center">
            <BreadcrumbItem>
              {item?.path ? (
                <BreadcrumbLink asChild>
                  <Link
                    to={item?.path}
                    className="flex items-center font-medium gap-1">
                    {item?.icon && item?.icon}
                    {item?.title}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="flex items-center gap-1 line-clamp-1">
                  {item?.icon && item?.icon}
                  {item?.title}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < allItems?.length - 1 && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
