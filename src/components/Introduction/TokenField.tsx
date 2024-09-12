import { Input } from "@mui/material";
import { setToken, useToken } from "../../store/token";
import { useAppDispatch } from "../../store/hooks";

export const TokenField = () => {
  const token = useToken();
  const dispatch = useAppDispatch();

  const onTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
