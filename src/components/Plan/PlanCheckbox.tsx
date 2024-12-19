import { Checkbox } from "@mui/material";
import { useAppDispatch } from "../../store/hooks";
import type { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import type { ReactElement } from "react";

interface PlanCheckboxProps<T, U extends string> {
  id: string;
  elem: T;
  add: ActionCreatorWithPayload<T, U>;
  remove: ActionCreatorWithPayload<T, U>;
  useIsPlanned: (id: string) => boolean;
}
export const PlanCheckbox = <T, U extends string>({
  id,
  elem,
  add,
  remove,
  useIsPlanned,
}: PlanCheckboxProps<T, U>): ReactElement => {
  const dispatch = useAppDispatch();
  const isPlanned = useIsPlanned(id);

  const onChange = (_: unknown, checked: boolean): void => {
    dispatch(checked ? add(elem) : remove(elem));
  };
  return <Checkbox checked={isPlanned} onChange={onChange} />;
};
