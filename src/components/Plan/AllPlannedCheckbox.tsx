import type { ReactElement } from "react";
import { useAppDispatch } from "../../store/hooks";
import type { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { Checkbox } from "@mui/material";

interface AllPlannedCheckboxProps<T, U extends string> {
  elems: T[];
  useIsAllPlanned: () => boolean;
  add: ActionCreatorWithPayload<T, U>;
  remove: ActionCreatorWithPayload<T, U>;
}

export const AllPlannedCheckbox = <T, U extends string>({
  elems,
  useIsAllPlanned,
  add,
  remove,
}: AllPlannedCheckboxProps<T, U>): ReactElement => {
  const dispatch = useAppDispatch();
  const allPlanned = useIsAllPlanned();

  const onAllCheck = (_: unknown, checked: boolean): void => {
    const f = checked ? add : remove;
    elems.forEach((e) => dispatch(f(e)));
  };
  return <Checkbox checked={allPlanned} onChange={onAllCheck} />;
};
