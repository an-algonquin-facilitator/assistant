import { Box, Button } from "@mui/material";
import { useState } from "react";
import { ValidateTokenModal } from "./Validation/ValidateTokenModal";
import { AcceptRiskModal } from "../Risk/AcceptRiskModal";
import { ShouldWarn } from "../Risk/Risk";
import { PageProps } from "../Assistant/Assistant";
import { Instructions } from "./Instructions";
import { TokenField } from "./TokenField";
import { useToken } from "../../store/token";

export const IntroductionStep = ({ next }: PageProps) => {
  const token = useToken();
  const [openValidate, setOpenValidate] = useState(false);
  const [openAcceptRisk, setOpenAcceptRisk] = useState(ShouldWarn());

  const onValidate = (valid: boolean) => {
    setOpenValidate(false);
    if (valid) {
      localStorage.setItem("token", token);
      next();
    }
  };

  const onAcceptRisk = () => {
    setOpenAcceptRisk(false);
  };

  return (
    <>
      <Instructions />
      <TokenField />
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Button disabled={token === ""} onClick={() => setOpenValidate(true)}>
          Validate
        </Button>
      </Box>
      <ValidateTokenModal
        open={openValidate}
        onClose={() => setOpenValidate(false)}
        onValidate={onValidate}
      />
      <AcceptRiskModal
        open={openAcceptRisk}
        onClose={() => setOpenAcceptRisk(false)}
        onAccept={onAcceptRisk}
      />
    </>
  );
};
