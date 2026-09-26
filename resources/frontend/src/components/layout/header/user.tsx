import { UserRound } from "lucide-react";
import { Button } from "../../ui/button";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { useGetUserQuery } from "@/api/queries/useUser";
import {
    getGuestUserId,
    getProfileImage,
    getUUID,
    isAuthenticated,
} from "@/helper";
import { useEffect } from "react";

import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";
import { ProfileCard } from "@/components/card/profile";
import type { UserType } from "@/type";

interface Props {
    variant?: "desktop" | "mobile";
}

export const UserProfile = ({ variant = "desktop" }: Props) => {
    const location = useLocation();
    const { data } = useGetUserQuery();
    const user = data?.user as unknown as UserType;

    useEffect(() => {
        if (!getGuestUserId() && !isAuthenticated()) {
            const guestUserId = getUUID();
            setTimeout(() => {
                localStorage.setItem("guest_user_id", guestUserId);
            }, 5000);
        }
    }, []);

    const linkTo = isAuthenticated() ? "/dashboard" : "/signin";

    const Desktop = () => {
        return (
            <Button
                variant="outline"
                size="icon-lg"
                className={cn(
                    "border-border bg-transparent text-foreground",
                    "hover:bg-primary hover:text-primary-foreground",
                    "focus:outline-none",
                )}
                asChild
            >
                <Link to={linkTo}>
                    {isAuthenticated() ? (
                        <Avatar className="rounded-full">
                            <AvatarImage src={getProfileImage(user)} />
                            <AvatarFallback className="bg-transparent text-foreground">
                                {user?.name?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                    ) : (
                        <UserRound className="h-6 w-6" strokeWidth={2.5} />
                    )}
                </Link>
            </Button>
        );
    };

    const Mobile = () => {
        if (isAuthenticated()) {
            return (
                <Sheet>
                    <SheetTrigger asChild>
                        <button className="flex flex-col items-center justify-center min-w-0 flex-1">
                            <Avatar className="border border-primary size-6">
                                <AvatarImage
                                    src={
                                        user
                                            ? user?.avatar || undefined
                                            : undefined
                                    }
                                />
                                <AvatarFallback className="text-xs text-primary">
                                    {user?.name?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <span
                                className={cn(
                                    "text-[10px] font-medium",
                                    location.pathname?.includes("/dashboard")
                                        ? "text-primary"
                                        : "text-foreground",
                                )}
                            >
                                {"Account"}
                            </span>
                        </button>
                    </SheetTrigger>
                    <SheetContent side="left" className="border-none">
                        <ProfileCard />
                    </SheetContent>
                </Sheet>
            );
        }

        return (
            <Link
                to={linkTo}
                className="flex flex-col items-center justify-center min-w-0 flex-1"
            >
                <UserRound className={cn("h-5 w-5 mb-1 text-foreground")} />
                <span
                    className={cn(
                        "text-[10px] font-medium text-foreground hover:text-primary",
                    )}
                >
                    Account
                </span>
            </Link>
        );
    };

    return variant === "desktop" ? <Desktop /> : <Mobile />;
};
