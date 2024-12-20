import { Box } from "@mui/material";
import type { ReactElement } from "react";
import { AcceptRiskModal } from "../Risk/AcceptRiskModal";
import type { PageProps } from "../Assistant/Assistant";
import { Instructions } from "./Instructions";
import { TokenField } from "./TokenField";
import { ValidateTokenButton } from "./Validation/ValidateTokenButton";

export const IntroductionStep = ({ next }: PageProps): ReactElement => {
  return (
    <>
      <Instructions />
      <TokenField />
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <ValidateTokenButton next={next} />
      </Box>
      <AcceptRiskModal />
    </>
  );
};
