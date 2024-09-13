import { Step, StepLabel, Stepper } from "@mui/material";
import type { FC } from "react";
import { useState } from "react";
import { IntroductionStep } from "../Introduction/IntroductionStep";
import { ClassSelectionStep } from "../ClassSelection/ClassSelectionStep";
import { UploadTemplateStep } from "../UploadTemplate/UploadTemplateStep";
import { PlanStep } from "../Plan/PlanStep";
import { ReviewStep } from "../Review/ReviewStep";
import { ApplyStep } from "../Apply/ApplyStep";

interface AssistantStep {
  Label: string;
  Page: FC<PageProps>;
}

export interface PageProps {
  previous: () => void;
  next: () => void;
}

const steps: AssistantStep[] = [
  { Label: "Setup", Page: IntroductionStep },
  { Label: "Select Class", Page: ClassSelectionStep },
  { Label: "Upload Template", Page: UploadTemplateStep },
  { Label: "Plan", Page: PlanStep },
  { Label: "Review", Page: ReviewStep },
  { Label: "Apply", Page: ApplyStep },
];

export const Assistant = () => {
  const [activeStep, setActiveStep] = useState(0);

  const CurrentPage = steps[activeStep].Page;
  const pageProps = {
    previous(): void {
      if (activeStep > 0) setActiveStep((s) => s - 1);
    },
    next(): void {
      if (activeStep < steps.length - 1) setActiveStep((s) => s + 1);
    },
  };
  return (
    <>
      <Stepper sx={{ m: 2 }} activeStep={activeStep}>
        {steps.map((s, index) => {
          return (
            <Step key={index}>
              <StepLabel>{s.Label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <CurrentPage {...pageProps} />
    </>
  );
};
