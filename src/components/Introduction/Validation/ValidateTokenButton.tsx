import { useState, type ReactElement } from "react";
import { ValidateTokenModal } from "./ValidateTokenModal";
import { Button } from "@mui/material";
import { useIsTokenSet } from "../../../store/token";
import { useAppStore } from "../../../store/hooks";

interface ValidateTokenButtonProps {
  next: () => void;
}

export const ValidateTokenButton = ({
  next,
}: ValidateTokenButtonProps): ReactElement => {
  const isTokenSet = useIsTokenSet();
  const store = useAppStore();
  const [open, setOpen] = useState(false);

  const onValidate = (): void => {
    localStorage.setItem("token", store.getState().token.value);
    next();
  };
  return (
    <>
      <Button disabled={!isTokenSet} onClick={() => setOpen(true)}>
        Validate
      </Button>
      <ValidateTokenModal
        open={open}
        onClose={() => setOpen(false)}
        onValidate={onValidate}
      />
    </>
  );
};
