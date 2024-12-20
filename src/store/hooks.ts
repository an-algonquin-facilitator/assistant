import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector, useStore } from "react-redux";
import type { RootState, AppDispatch, Store } from "./store";

export const useAppDispatch = (): ReturnType<typeof useDispatch<AppDispatch>> =>
  useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppStore: () => Store = useStore;
