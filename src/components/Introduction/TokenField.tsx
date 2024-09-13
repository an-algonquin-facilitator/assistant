import { Input } from "@mui/material";
import { setToken, useToken } from "../../store/token";
import { useAppDispatch } from "../../store/hooks";
import type { ReactElement } from "react";

export const TokenField = (): ReactElement => {
  const token = useToken();
  const dispatch = useAppDispatch();

  const onTokenChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(setToken(e.target.value));
  };
  return (
    <Input
      value={token}
      onChange={onTokenChange}
      sx={{ width: "100%", mt: 4 }}
      placeholder="Copy paste the token here"
    ></Input>
  );
};
