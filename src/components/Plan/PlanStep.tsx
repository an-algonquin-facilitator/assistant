import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { PageProps } from "../Assistant/Assistant";
import { useState } from "react";
import { TabPanel } from "./TabPanel";
import { AssignmentTab } from "./AssignmentTab";
import { processTemplate } from "./utils";
import {
  useTemplateAssignmentCount,
  useTemplateAssignments,
  useTemplateNews,
  useTemplateNewsCount,
  useTemplateQuizCount,
  useTemplateQuizzes,
} from "../../store/template";
import { useCourse, useFolders, useQuizzes } from "../../store/course";
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

export const PlanStep = ({ previous, next }: PageProps) => {
  const [tab, setTab] = useState(0);

  const plannedAssignmentCount = usePlanedAssignmentCount();
  const templateAssignmentCount = useTemplateAssignmentCount();

  const plannedQuizCount = usePlanedQuizCount();
  const templateQuizCount = useTemplateQuizCount();

  const plannedNewsCount = usePlanedNewsCount();
  const templateNewsCount = useTemplateNewsCount();
  const template = {
    assignments: useTemplateAssignments(),
    quizzes: useTemplateQuizzes(),
    news: useTemplateNews(),
  };
  const course = useCourse();
  const quizzes = useQuizzes();
  const folders = useFolders();
  const isAnythingPlanned = useIsAnythingPlanned();
  const dispatch = useAppDispatch();
  const plan = processTemplate(template, course.data!, quizzes, folders);

  const onPrevious = () => {
    dispatch(resetPlan());
    previous();
  };

  return (
    <>
      <Typography variant="h4">
        Select the templates you want to apply
      </Typography>
      <Tabs variant="fullWidth" value={tab} onChange={(_, v) => setTab(v)}>
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
