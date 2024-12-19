import { Box } from "@mui/material";
import type { ReactElement } from "react";
import { useState } from "react";
import { AcceptRiskModal } from "../Risk/AcceptRiskModal";
import { ShouldWarn } from "../Risk/Risk";
import type { PageProps } from "../Assistant/Assistant";
import { Instructions } from "./Instructions";
import { TokenField } from "./TokenField";
import { useToken } from "../../store/token";
import { ValidateTokenButton } from "./Validation/ValidateTokenButton";

export const IntroductionStep = ({ next }: PageProps): ReactElement => {
  const token = useToken();
  const [openAcceptRisk, setOpenAcceptRisk] = useState(ShouldWarn());

  const onAcceptRisk = (): void => setOpenAcceptRisk(false);
  const onValidate = (): void => {
    localStorage.setItem("token", token);
    next();
  };

  return (
    <>
      <Instructions />
      <TokenField />
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <ValidateTokenButton token={token} onValidate={onValidate} />
      </Box>
      <AcceptRiskModal
        open={openAcceptRisk}
        onClose={() => setOpenAcceptRisk(false)}
        onAccept={onAcceptRisk}
      />
    </>
  );
};
