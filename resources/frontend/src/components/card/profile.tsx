import { useGetUserQuery } from "@/api/queries/useUser";
import {
  Home,
  FileText,
  Heart,
  User,
  LogOutIcon,
  ShoppingCart,
  Camera,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSignOutMutation } from "@/api/mutations/useAuth";
import { Link, useLocation } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUpdateProfileImageMutation } from "@/api/mutations/useProfIle";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import { getProfileImage, getUserId, isPathActive } from "@/helper";
import type { UserType } from "@/type";
import { useModal } from "@/hooks/useModal";
import { ModalWrapper } from "../common/modal-wrapper";
import { SignOutModal } from "../common/signout-modal";

interface Props {
  className?: string;
  width?: string;
}

export const ProfileCard = ({ className, width }: Props) => {
  const location = useLocation();
  const { data, isLoading } = useGetUserQuery();
  const { mutate, isPending } = useSignOutMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: updateAvatarFn, isPending: isUpdatingAvatar } =
    useUpdateProfileImageMutation();
  const { modalRef, modalConfig, onHideModal, onShowModal } = useModal();

  const user = data?.user as unknown as UserType;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      const formData = new FormData();
      formData.append("id", getUserId() as string);
      formData.append("image", file);
      formData.append("filename", file?.name || "profile.png");
      updateAvatarFn(formData);
    }
  };

  const handleEditAvatar = () => {
    fileInputRef.current?.click();
  };

  const menuItems = [
    {
      icon: Home,
      label: "Dashboard",
      href: "/dashboard",
      action: null,
    },
    {
      icon: User,
      label: "Manage Profile",
      href: "/dashboard/profile",
      action: null,
    },
    {
      icon: FileText,
      label: "Purchase History",
      href: "/dashboard/orders",
      action: null,
    },
    {
      icon: Truck,
      label: "Track Order",
      href: "/dashboard/track-order",
      action: null,
    },
    {
      icon: Heart,
      label: "My Wishlist",
      href: "/dashboard/wishlist",
      action: null,
    },
    {
      icon: ShoppingCart,
      label: "My Cart",
      href: "/cart",
      action: null,
    },
    {
      icon: LogOutIcon,
      label: "Sign Out",
      href: null,
      action: () => onShowModal("SIGN_OUT", "Sign Out", "max-w-md"),
    },
  ];

  if (isLoading) {
    return (
      <div
        className={cn("bg-card overflow-hidden", className)}
        style={{ width }}>
        <div className="bg-primary p-6 text-center">
          <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-muted rounded mx-auto mb-2 w-48 animate-pulse"></div>
          <div className="h-4 bg-muted rounded mx-auto w-64 animate-pulse"></div>
        </div>
        <div className="p-4 space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-muted rounded animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn("bg-card overflow-hidden", className)}
        style={{ width }}>
        <div className="bg-primary p-6 text-center">
          <div className="size-16 relative rounded-full mx-auto group">
            {getProfileImage(user) ? (
              <Avatar className="size-full">
                <AvatarImage src={getProfileImage(user)} />
                <AvatarFallback className="text-primary uppercase">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="absolute flex items-center justify-center size-full bg-muted rounded-full">
                <User className="w-8 h-8 text-foreground" />
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={handleEditAvatar}
              disabled={isUpdatingAvatar}
              className="z-10 absolute bottom-2 p-1 bg-accent rounded-full -right-3 cursor-pointer">
              <Camera className="size-5 z-10 text-primary" />
            </button>
          </div>

          <h3 className="text-primary-foreground font-bold text-lg mb-1 uppercase">
            {user?.name || "USER NAME"}
          </h3>

          <p className="text-primary-foreground text-sm opacity-90">
            {user?.email || user?.phone || "user@example.com"}
          </p>
        </div>

        <div className="p-4">
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;

              if (item?.action && item?.href === null) {
                return (
                  <button
                    key={index}
                    onClick={item.action}
                    disabled={isPending}
                    className="flex hover:bg-destructive/10 cursor-pointer items-center space-x-3 px-3 py-2 rounded-md transition-colors duration-200 group w-full text-left disabled:opacity-50">
                    <IconComponent className="w-5 h-5  text-destructive  transition-colors duration-200" />
                    <span className="text-destructive transition-colors duration-200">
                      {item.label}
                    </span>
                  </button>
                );
              }

              return (
                <Link
                  key={index}
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-muted transition-colors duration-200 group ${
                    isPathActive(location.pathname, item.href)
                      ? "bg-primary/10"
                      : ""
                  }`}>
                  <IconComponent
                    className={`w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200 ${
                      isPathActive(location.pathname, item.href)
                        ? "text-primary"
                        : ""
                    }`}
                  />
                  <span
                    className={`text-foreground group-hover:text-primary transition-colors duration-200 ${
                      isPathActive(location.pathname, item.href)
                        ? "text-primary"
                        : ""
                    }`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <ModalWrapper
        ref={modalRef}
        title={modalConfig.title}
        width={modalConfig.size}
        onHide={onHideModal}>
        {modalConfig.type === "SIGN_OUT" && (
          <SignOutModal
            onHideModal={onHideModal}
            onSignOut={() => mutate()}
            isPending={isPending}
          />
        )}
      </ModalWrapper>
    </>
  );
};
