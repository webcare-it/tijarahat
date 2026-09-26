import { combineReducers, configureStore } from "@reduxjs/toolkit";
import CartReducer from "../slice/cartSlice";
import WishlistReducer from "../slice/wishlistSlice";
import CampaignReducer from "../slice/campaignSlice";

const appReducer = combineReducers({
  cart: CartReducer,
  wishlist: WishlistReducer,
  campaign: CampaignReducer,
});

export type RootStateType = ReturnType<typeof appReducer>;

export const store = configureStore({
  reducer: appReducer,
});
