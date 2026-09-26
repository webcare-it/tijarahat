import { HomePage } from "./home";
import { Routes, Route } from "react-router";
import { SignInPage } from "./auth/signin";
import { SignUpPage } from "./auth/signup";
import { CategoriesPage } from "./categories";
import { NotFoundPage } from "./utils-pages/notfound";
import { SearchPage } from "./search";
import { ProductsPage } from "./products";
import { ProductDetailsPage } from "./details";
import { WishlistPrivatePage, WishlistPublicPage } from "./wishlist";
import { CartPage } from "./cart";
import {
    CategoriesProductPage,
    CategoriesSubCategoryProductPage,
    CategoriesSubSubCategoryProductPage,
} from "./categories/product";
import { CheckoutPage } from "./checkout";
import { PolicyPage } from "./policy";
import { OrderDetailsPage } from "./orders/id";
import { ProfilePage } from "./profile";
import { DashboardPage } from "./dashboard";
import { OrdersPage } from "./orders";
import { OrderCompletePage } from "./complete";
import { ServerError } from "./utils-pages/server";
import { MaintenancePage } from "./utils-pages/maintenance";
import { BrandsPage } from "./brands";
import { LandingPage } from "./landing-page";
import { OrderTrackGuestPage, OrderTrackUserPage } from "./order-track";
import { OrderTrackIdPage } from "./order-track/id";
import { ForgotPasswordPage } from "./auth/forgot";
import { OrderTrackDetailsGuestPage } from "./order-track/guest-id";
import { FlashDealPage } from "./flash-deal";
import { HighlightsPage } from "./highlights";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route
                path="/categories/:id/:name"
                element={<CategoriesProductPage />}
            />
            <Route
                path="/categories/:id/:name/:subId/:subName"
                element={<CategoriesSubCategoryProductPage />}
            />
            <Route
                path="/categories/:id/:name/:subId/:subName/:subSubId/:subSubName"
                element={<CategoriesSubSubCategoryProductPage />}
            />
            <Route path="/brands/:id/:name" element={<BrandsPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route
                path="/products/:id/:name"
                element={<ProductDetailsPage />}
            />
            <Route
                path="/products/highlights/:slug"
                element={<HighlightsPage />}
            />
            <Route path="/flash-deal/:id/:name" element={<FlashDealPage />} />
            <Route path="/wishlist" element={<WishlistPublicPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/track-order" element={<OrderTrackGuestPage />} />
            <Route
                path="/track-order/:id"
                element={<OrderTrackDetailsGuestPage />}
            />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders/:id" element={<OrderDetailsPage />} />
            <Route path="/orders/details/:id" element={<OrderCompletePage />} />
            <Route path="/pages/:key" element={<PolicyPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/orders" element={<OrdersPage />} />
            <Route
                path="/dashboard/track-order"
                element={<OrderTrackUserPage />}
            />
            <Route
                path="/dashboard/track-order/:id"
                element={<OrderTrackIdPage />}
            />
            <Route
                path="/dashboard/orders/:id"
                element={<OrderDetailsPage />}
            />
            <Route path="/dashboard/profile" element={<ProfilePage />} />
            <Route
                path="/dashboard/wishlist"
                element={<WishlistPrivatePage />}
            />
            <Route path="/500" element={<ServerError />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/campaign/:slug" element={<LandingPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};
