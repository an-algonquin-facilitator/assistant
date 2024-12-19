import { useState, type ReactElement } from "react";
import { ValidateTokenModal } from "./ValidateTokenModal";
import { Button } from "@mui/material";

interface ValidateTokenButtonProps {
  token: string;
  onValidate: () => void;
}

export const ValidateTokenButton = ({
  token,
  onValidate,
}: ValidateTokenButtonProps): ReactElement => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button disabled={token === ""} onClick={() => setOpen(true)}>
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
