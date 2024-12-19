import type { ReactElement } from "react";
import { useMemo, useState } from "react";
import { useTemplate } from "../../store/template";
import { useCourse } from "../../store/course";
import { processTemplate } from "./utils";
import { Tab, Tabs } from "@mui/material";
import { TabPanel } from "./TabPanel";
import { AssignmentPanel } from "./AssignmentPanel";
import { QuizPanel } from "./QuizPanel";
import { NewsPanel } from "./NewsPanel";
import { AssignmentTabLabel } from "./AssignmentTabLabel";
import { QuizzesTabLabel } from "./QuizzesTabLabel";
import { NewsTabLabel } from "./NewsTabLabel";

export const Planner = (): ReactElement => {
  const [tab, setTab] = useState(0);
  const template = useTemplate();
  const course = useCourse();

  const plan = useMemo(
    () => processTemplate(template, course),
    [template, course],
  );

  return (
    <>
      <Tabs
        variant="fullWidth"
        value={tab}
        onChange={(_, v: number) => setTab(v)}
      >
        <Tab label={<AssignmentTabLabel />} />
        <Tab label={<QuizzesTabLabel />} />
        <Tab label={<NewsTabLabel />} />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <AssignmentPanel assignments={plan.assignments} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <QuizPanel quizzes={plan.quizzes} />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <NewsPanel news={plan.news} />
      </TabPanel>
    </>
  );
};
