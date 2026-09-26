import type { StateSyncType } from "../../type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartStateType {
  items: StateSyncType[];
}

const initialState: CartStateType = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlistFn: (state, action: PayloadAction<StateSyncType>) => {
      state.items?.push(action.payload);
    },

    removeFromWishlistFn: (state, action: PayloadAction<number>) => {
      state.items = state.items?.filter((item) => item?.id !== action.payload);
    },

    incrementFn: (state, action: PayloadAction<number>) => {
      const item = state.items?.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },

    decrementFn: (state, action: PayloadAction<number>) => {
      const item = state.items?.find((item) => item.id === action.payload);
      if (item) {
        item.quantity = Math.max(1, item.quantity - 1);
      }
    },

    clearWishlistFn: (state) => {
      state.items = [];
    },
    setWishlistItemsFn: (state, action: PayloadAction<StateSyncType[]>) => {
      state.items = action.payload;
    },
  },
});

export const {
  addToWishlistFn,
  removeFromWishlistFn,
  incrementFn,
  decrementFn,
  clearWishlistFn,
  setWishlistItemsFn,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
