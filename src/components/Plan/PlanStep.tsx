import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import type { PageProps } from "../Assistant/Assistant";
import type { ReactElement } from "react";
import { useState } from "react";
import { TabPanel } from "./TabPanel";
import { AssignmentTab } from "./AssignmentTab";
import { processTemplate } from "./utils";
import { useTemplate } from "../../store/template";
import { useCourse } from "../../store/course";
import {
  resetPlan,
  useIsAnythingPlanned,
  usePlanedAssignmentCount,
  usePlanedNewsCount,
  usePlanedQuizCount,
} from "../../store/plan";
import { QuizTab } from "./QuizTab";
import { NewsTab } from "./NewsTab";
import { useAppDispatch } from "../../store/hooks";

export const PlanStep = ({ previous, next }: PageProps): ReactElement => {
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState(0);
  const template = useTemplate();
  const course = useCourse();

  const isAnythingPlanned = useIsAnythingPlanned();

  const plannedAssignmentCount = usePlanedAssignmentCount();
  const plannedQuizCount = usePlanedQuizCount();
  const plannedNewsCount = usePlanedNewsCount();

  const templateAssignmentCount = template.assignments.length;
  const templateQuizCount = template.quizzes.length;
  const templateNewsCount = template.news.length;

  const plan = processTemplate(template, course);

  const onPrevious = (): void => {
    dispatch(resetPlan());
    previous();
  };

  return (
    <>
      <Typography variant="h4">
        Select the templates you want to apply
      </Typography>
      <Tabs
        variant="fullWidth"
        value={tab}
        onChange={(_, v: number) => setTab(v)}
      >
        <Tab
          label={`Assignments (${plannedAssignmentCount}/${templateAssignmentCount})`}
        />
        <Tab label={`Quizzes (${plannedQuizCount}/${templateQuizCount})`} />
        <Tab label={`News (${plannedNewsCount}/${templateNewsCount})`} />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <AssignmentTab assignments={plan.assignments} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <QuizTab quizzes={plan.quizzes} />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <NewsTab news={plan.news} />
      </TabPanel>
      <Box
        sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}
      >
        <Button onClick={onPrevious}>BACK</Button>
        <Button onClick={next} disabled={!isAnythingPlanned}>
          REVIEW
        </Button>
      </Box>
    </>
  );
};
