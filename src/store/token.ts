import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "./hooks";

interface TokenState {
  value: string;
}

export const localStorageTokenKey = "token";

const initialState: TokenState = {
  value: localStorage.getItem(localStorageTokenKey) ?? "",
};

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setToken } = tokenSlice.actions;

export const useToken = (): string => useAppSelector((s) => s.token.value);

export const tokenReducer = tokenSlice.reducer;
