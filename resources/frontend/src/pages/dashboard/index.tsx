import { SectionTitle } from "@/components/common/section-title";
import { SeoWrapper } from "@/components/common/seo-wrapper";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { BreadcrumbWrapper } from "@/components/common/breadcrumb-wrapper";
import { Card } from "@/components/ui/card";
import {
    ShoppingBag,
    CheckCircle2,
    Clock,
    Heart,
    ShoppingCart,
    CreditCard,
} from "lucide-react";
import { motion } from "framer-motion";
import { useGetDashboard } from "@/api/queries/useDashboard";

interface DashboardStateType {
    title: string;
    value: number;
    subtitle?: string;
    icon: React.ComponentType<{ className?: string }>;
    gradient: string;
    bgGradient: string;
    iconBg: string;
}

interface DashboardDataType {
    cart_count: number;
    wishlist_count: number;
    total_ordered_products: number;
    pending_orders_count: number;
    delivered_orders_count: number;
    default_address: string;
    customer_package: string;
    total_amount: number;
}

export const DashboardPage = () => {
    const { data } = useGetDashboard();

    const dashboardData = (data?.dashboard_summary as DashboardDataType) || {};

    const stats: DashboardStateType[] = [
        {
            title: "My Orders",
            value: dashboardData?.total_ordered_products || 0,
            subtitle: "All time orders",
            icon: ShoppingBag,
            gradient: "from-blue-500 via-blue-600 to-indigo-600",
            bgGradient: "from-blue-500/10 via-blue-600/5 to-transparent",
            iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
        },
        {
            title: "Pending orders",
            value: dashboardData?.pending_orders_count || 0,
            subtitle: "In progress",
            icon: Clock,
            gradient: "from-orange-500 via-amber-500 to-yellow-500",
            bgGradient: "from-orange-500/10 via-amber-500/5 to-transparent",
            iconBg: "bg-gradient-to-br from-orange-500 to-yellow-500",
        },
        {
            title: "Completed",
            value: dashboardData?.delivered_orders_count || 0,
            subtitle: "Successful deliveries",
            icon: CheckCircle2,
            gradient: "from-purple-500 via-violet-500 to-purple-600",
            bgGradient: "from-purple-500/10 via-violet-500/5 to-transparent",
            iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
        },
        {
            title: "Total Amount Spent",
            value: dashboardData?.total_amount || 0,
            subtitle: "Total amount of all orders",
            icon: CreditCard,
            gradient: "from-purple-500 via-violet-500 to-purple-600",
            bgGradient: "from-purple-500/10 via-violet-500/5 to-transparent",
            iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
        },
        {
            title: "Cart Items",
            value: dashboardData?.cart_count || 0,
            subtitle: "Saved items",
            icon: ShoppingCart,
            gradient: "from-green-500 via-emerald-500 to-teal-600",
            bgGradient: "from-green-500/10 via-emerald-500/5 to-transparent",
            iconBg: "bg-gradient-to-br from-green-500 to-teal-600",
        },

        {
            title: "Wishlist Items",
            value: dashboardData?.wishlist_count || 0,
            subtitle: "Saved items",
            icon: Heart,
            gradient: "from-pink-500 via-rose-500 to-pink-600",
            bgGradient: "from-pink-500/10 via-rose-500/5 to-transparent",
            iconBg: "bg-gradient-to-br from-pink-500 to-pink-600",
        },
    ];

    return (
        <>
            <SeoWrapper title={"My Dashboard"} />
            <DashboardLayout>
                <div className="mx-4 md:mx-0 mb-4">
                    <BreadcrumbWrapper
                        type="dashboard"
                        items={[
                            {
                                title: "Dashboard Overview",
                            },
                        ]}
                    />
                </div>
                <SectionTitle title={"My Dashboard"} />

                <div className="mx-4 md:mx-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.1,
                                }}
                                whileHover={{
                                    y: -8,
                                    transition: { duration: 0.2 },
                                }}
                                className="h-full"
                            >
                                <Card className="group relative h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden bg-card">
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                                    />

                                    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                    <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-tr from-white/5 to-transparent blur-3xl group-hover:scale-150 transition-transform duration-700" />

                                    <div className="relative p-4 md:p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`relative ${stat.iconBg} p-4 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                                                >
                                                    <stat.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                                                    <div className="absolute inset-0 bg-white/20 rounded-2xl blur-sm" />
                                                </div>
                                                <p className="text-base font-medium text-muted-foreground uppercase tracking-wider">
                                                    {stat.title}
                                                </p>
                                            </div>
                                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse" />
                                        </div>

                                        <div className="flex items-center gap-2 space-y-2">
                                            <h3
                                                className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                                            >
                                                {stat.value}
                                            </h3>
                                            {stat?.subtitle && (
                                                <p className="text-sm text-muted-foreground/80">
                                                    {stat.subtitle}
                                                </p>
                                            )}
                                        </div>

                                        <div
                                            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                                        />
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
};
