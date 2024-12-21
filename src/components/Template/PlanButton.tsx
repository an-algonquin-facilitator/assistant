import type { ReactElement } from "react";
import { Button } from "@mui/material";
import { useIsTemplateValid } from "../../store/template";

interface PlanButtonProps {
  onClick: () => void;
}

export const PlanButton = ({ onClick }: PlanButtonProps): ReactElement => {
  const isValid = useIsTemplateValid();

  return (
    <Button onClick={onClick} disabled={!isValid}>
      PLAN
    </Button>
  );
};
