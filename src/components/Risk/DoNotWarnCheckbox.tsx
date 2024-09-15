import { Checkbox, FormControlLabel } from "@mui/material";
import { SetDoNotWarn } from "./Risk";
import type { ReactElement } from "react";

export const DoNotWarnCheckbox = (): ReactElement => {
  const onCheckboxClick = (_: unknown, checked: boolean): void => {
    SetDoNotWarn(checked);
  };
  return (
    <FormControlLabel
      sx={{ justifyContent: "center" }}
      control={<Checkbox onChange={onCheckboxClick} />}
      label="do not warn me again"
    />
  );
};
