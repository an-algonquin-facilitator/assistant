import { Box, Button } from "@mui/material";
import type { PageProps } from "../Assistant/Assistant";
import { ClassSelectionField } from "./ClassSelectionField";
import { ClassSummary } from "./ClassSummary";
import { resetCourse, useIsCourseReady } from "../../store/course";
import { useAppDispatch } from "../../store/hooks";
import type { ReactElement } from "react";

export const ClassSelectionStep = ({
  previous,
  next,
}: PageProps): ReactElement => {
  const ready = useIsCourseReady();
  const dispatch = useAppDispatch();
  const onPrevious = (): void => {
    dispatch(resetCourse());
    previous();
  };
  const onNext = (): void => {
    next();
  };
  return (
    <>
      <ClassSelectionField />
      <ClassSummary />
      <Box
        sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}
      >
        <Button onClick={onPrevious}>BACK</Button>
        <Button onClick={onNext} disabled={!ready}>
          NEXT
        </Button>
      </Box>
    </>
  );
};
