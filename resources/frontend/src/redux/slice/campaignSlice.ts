import type { StateSyncType } from "../../type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartStateType {
  items: StateSyncType[];
}

const initialState: CartStateType = {
  items: [],
};

const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {
    addToCartCampaign: (state, action: PayloadAction<StateSyncType>) => {
      state.items.push(action.payload);
    },

    removeFromCampaign: (state, action: PayloadAction<number>) => {
      state.items = state.items?.filter((item) => item?.id !== action.payload);
    },

    incrementCampaign: (state, action: PayloadAction<number>) => {
      const item = state.items?.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },

    decrementCampaign: (state, action: PayloadAction<number>) => {
      const item = state.items?.find((item) => item.id === action.payload);
      if (item) {
        item.quantity = Math.max(1, item.quantity - 1);
      }
    },

    clearCampaign: (state) => {
      state.items = [];
    },
    setCartItemsCampaign: (state, action: PayloadAction<StateSyncType[]>) => {
      state.items = action.payload;
    },
  },
});

export const {
  addToCartCampaign,
  removeFromCampaign,
  incrementCampaign,
  decrementCampaign,
  clearCampaign,
  setCartItemsCampaign,
} = campaignSlice.actions;

export default campaignSlice.reducer;
