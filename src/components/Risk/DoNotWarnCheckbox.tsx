import { Checkbox, FormControlLabel } from "@mui/material";
import { SetDoNotWarn } from "./Risk";

export const DoNotWarnLocalStorageKey = "DO_NOT_WARN";

export const DoNotWarnCheckbox = () => {
  const onCheckboxClick = (_: unknown, checked: boolean) => {
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
