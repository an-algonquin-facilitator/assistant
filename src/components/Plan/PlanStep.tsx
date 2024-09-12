import { Tab, Tabs, Typography } from "@mui/material";
import { PageProps } from "../Assistant/Assistant";
import { useState } from "react";
import { TabPanel } from "./TabPanel";
import { AssignmentTab } from "./AssignmentTab";
import { processTemplate } from "./utils";
import { useStartDateUnixMS, useTemplate } from "../../store/template";
import { useCourse, useFolders, useQuizzes } from "../../store/course";

export const PlanStep = ({ previous, next }: PageProps) => {
  const [tab, setTab] = useState(0);

  const template = useTemplate();
  const course = useCourse();
  const quizzes = useQuizzes();
  const folders = useFolders();
  const startDateUnixMS = useStartDateUnixMS();
  const plan = processTemplate(
    template,
    course.data!,
    quizzes,
    folders,
    startDateUnixMS
  );

  return (
    <>
      <Typography variant="h4">
        Select the templates you want to apply
      </Typography>
      <Tabs
        variant="fullWidth"
        value={tab}
        onChange={(_, v) => setTab(v)}
        aria-label="basic tabs example"
      >
        <Tab label="Assignments" />
        <Tab label="Quizzes" />
        <Tab label="Announcements" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <AssignmentTab plan={plan} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={tab} index={2}>
        Item Three
      </TabPanel>
    </>
  );
};
