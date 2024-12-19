import { Box, Button, Typography } from "@mui/material";
import type { PageProps } from "../Assistant/Assistant";
import type { ReactElement } from "react";
import { resetPlan, useIsAnythingPlanned } from "../../store/plan";
import { useAppDispatch } from "../../store/hooks";
import { Planner } from "./Planner";

const ReviewButton = ({ next }: PageProps): ReactElement => {
  const isAnythingPlanned = useIsAnythingPlanned();
  return (
    <Button onClick={next} disabled={!isAnythingPlanned}>
      REVIEW
    </Button>
  );
};

export const PlanStep = (props: PageProps): ReactElement => {
  const dispatch = useAppDispatch();

  const onPrevious = (): void => {
    dispatch(resetPlan());
    props.previous();
  };

  return (
    <>
      <Typography variant="h4">
        Select the templates you want to apply
      </Typography>
      <Planner />
      <Box
        sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}
      >
        <Button onClick={onPrevious}>BACK</Button>
        <ReviewButton {...props} />
      </Box>
    </>
  );
};
