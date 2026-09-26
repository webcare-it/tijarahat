import type { StateSyncType } from "../../type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartStateType {
  items: StateSyncType[];
}

const initialState: CartStateType = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCartFn: (state, action: PayloadAction<StateSyncType>) => {
      state.items.push(action.payload);
    },

    removeFromCartFn: (state, action: PayloadAction<number>) => {
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

    clearCartFn: (state) => {
      state.items = [];
    },
    setCartItemsFn: (state, action: PayloadAction<StateSyncType[]>) => {
      state.items = action.payload;
    },
  },
});

export const {
  addToCartFn,
  removeFromCartFn,
  incrementFn,
  decrementFn,
  clearCartFn,
  setCartItemsFn,
} = cartSlice.actions;

export default cartSlice.reducer;
