import {
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import {
  useCourseQuery,
  useFoldersQuery,
  useQuizzesQuery,
} from "../../api/api";
import { RootState } from "../../store/store";
import {
  IAssignmentPlan,
  INewsPlan,
  IQuizPlan,
  setPlan,
} from "../../store/plan";

import { isDefined } from "../Introduction/utils";
import { ListWarnings } from "../ListWarnings";
import { ReviewAssignment } from "../ReviewAssignment";
import { ReviewQuiz } from "../ReviewQuiz";
import { ReviewNews } from "../ReviewNews";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { PageProps } from "../Assistant/Assistant";
import {
  TargetDateType,
  calculateDate,
  calculateDateWithHoliday,
} from "./utils";
import { useState } from "react";

export const PlanStep = ({ previous, next }: PageProps) => {
  const [tab, setTab] = useState(0);
  const courseId = useAppSelector(
    (state: RootState) => state.currentCourse.course?.data?.Identifier ?? ""
  );
  const { data: folders, loading: foldersLoading } = useFoldersQuery(courseId);
  const { data: quizzes, loading: quizzesLoading } = useQuizzesQuery(courseId);
  const { data: course, loading: courseLoading } = useCourseQuery(courseId);
  const template = useAppSelector((state: RootState) => state.template);
  const dispatch = useAppDispatch();
  const ass = template.data.assignments ?? [];
  const qu = template.data.quizzes ?? [];
  const ne = template.data.news ?? [];
  if (
    courseLoading ||
    foldersLoading ||
    quizzesLoading ||
    !course ||
    !folders ||
    !quizzes
  )
    return <CircularProgress />;

  return (
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
  );

  // const plan = {
  //   id: courseId,
  //   name: course.Name,
  //   news: ne
  //     .map((n): INewsPlan | undefined => {
  //       const defaultOpenOffset = {
  //         days: n.start?.days ?? 0,
  //         weeks: n.start?.weeks ?? 0,
  //       };

  //       const defaultDismissOffset = {
  //         days: n.start?.days ?? 0,
  //         weeks: (n.start?.weeks ?? 0) + 2,
  //       };
  //       return {
  //         name: n.name,
  //         content: n.content,
  //         open: calculateDate(
  //           template.startDateUnixMS,
  //           n.start ?? defaultOpenOffset,
  //           true
  //         ),
  //         openOffset: defaultOpenOffset,
  //         dismiss: calculateDate(
  //           template.startDateUnixMS,
  //           n.end ?? defaultDismissOffset,
  //           false
  //         ),
  //         dismissOffset: n.end ?? defaultDismissOffset,
  //       };
  //     })
  //     .filter(isDefined),
  //   quizzes: qu
  //     .map((q): IQuizPlan | undefined => {
  //       const bQ = quizzes.Objects.find((b) => b.Name === q.name);
  //       if (!bQ) return undefined;
  //       const defaultEndOffset = {
  //         days: q.due.days ?? 0,
  //         weeks: (q.due.weeks ?? 0) + 1,
  //       };
  //       const due = calculateDateWithHoliday(
  //         template.startDateUnixMS,
  //         q.due,
  //         TargetDateType.END
  //       );
  //       return {
  //         id: bQ.QuizId + "",
  //         templateId: q.id,
  //         name: bQ.Name,
  //         start: calculateDate(template.startDateUnixMS, q.start ?? {}, true),
  //         due: due[0],
  //         end: calculateDate(
  //           template.startDateUnixMS,
  //           q.end ?? defaultEndOffset,
  //           false
  //         ),

  //         holidayOffset: due[1],
  //         startOffset: q.start ?? {},
  //         dueOffset: q.due,
  //         endOffset: q.end ?? defaultEndOffset,
  //       };
  //     })
  //     .filter(isDefined),
  //   assignments: ass
  //     .map((a): IAssignmentPlan | undefined => {
  //       const f = folders.find((f) => f.Name === a.name);
  //       if (!f) return undefined;
  //       const defaultEndOffset = {
  //         days: a.due.days ?? 0,
  //         weeks: (a.due.weeks ?? 0) + 1,
  //       };
  //       const due = calculateDateWithHoliday(
  //         template.startDateUnixMS,
  //         a.due,
  //         TargetDateType.END
  //       );
  //       return {
  //         id: f.Id + "",
  //         templateId: a.id,
  //         name: f.Name,
  //         start: calculateDate(template.startDateUnixMS, a.start ?? {}, true),
  //         due: due[0],
  //         end: calculateDate(
  //           template.startDateUnixMS,
  //           a.end ?? defaultEndOffset,
  //           false
  //         ),

  //         holidayOffset: due[1],
  //         startOffset: a.start ?? {},
  //         dueOffset: a.due,
  //         endOffset: a.end ?? defaultEndOffset,
  //       };
  //     })
  //     .filter(isDefined),
  // };
  // const onReviewed = () => {
  //   next();
  //   dispatch(setPlan(plan));
  // };

  // const missingAssignmentsBrightspace = folders.filter(
  //   (f) => !ass.some((a) => a.name === f.Name)
  // );
  // const missingAssignmentsTemplate = ass.filter(
  //   (f) => !folders.some((a) => a.Name === f.name)
  // );

  // const missingQuizzesBrightspace = quizzes.Objects.filter(
  //   (b) => !qu.some((q) => q.name === b.Name)
  // );
  // const missingQuizzesTemplate = qu.filter(
  //   (q) => !quizzes.Objects.some((b) => b.Name === q.name)
  // );

  // return (
  //   <Box>
  //     <Typography variant="h3">Review</Typography>
  //     <Typography variant="h4">
  //       {course?.Name} ({courseId})
  //     </Typography>
  //     <ListWarnings
  //       explanation="The following assignments were found in Brightspace but not in your
  //             template. They will not be modified."
  //       warnings={missingAssignmentsBrightspace.map((m) => m.Name)}
  //     />
  //     <ListWarnings
  //       explanation="The following assignments were found in your template but not in
  //         Brightspace. It will not be applied."
  //       warnings={missingAssignmentsTemplate.map((m) => m.name)}
  //     />
  //     <ListWarnings
  //       explanation="The following quizzes were found in Brightspace but not in your
  //             template. They will not be modified."
  //       warnings={missingQuizzesBrightspace.map((m) => m.Name)}
  //     />
  //     <ListWarnings
  //       explanation="The following quizzes were found in your template but not in
  //         Brightspace. It will not be applied."
  //       warnings={missingQuizzesTemplate.map((m) => m.name)}
  //     />
  //     {plan.assignments.length > 0 && (
  //       <List>
  //         {plan.assignments.map((a) => (
  //           <ListItem
  //             key={a.name}
  //             sx={{
  //               display: "flex",
  //               flexDirection: "column",
  //               alignItems: "start",
  //             }}
  //           >
  //             <ReviewAssignment assignment={a} />
  //           </ListItem>
  //         ))}
  //       </List>
  //     )}
  //     {plan.quizzes.length > 0 && (
  //       <List>
  //         {plan.quizzes.map((a) => (
  //           <ListItem
  //             key={a.name}
  //             sx={{
  //               display: "flex",
  //               flexDirection: "column",
  //               alignItems: "start",
  //             }}
  //           >
  //             <ReviewQuiz quiz={a} />
  //           </ListItem>
  //         ))}
  //       </List>
  //     )}
  //     {plan.news.length > 0 && (
  //       <List>
  //         {plan.news.map((n) => (
  //           <ListItem
  //             key={n.name}
  //             sx={{
  //               display: "flex",
  //               flexDirection: "column",
  //               alignItems: "start",
  //             }}
  //           >
  //             <ReviewNews news={n} />
  //           </ListItem>
  //         ))}
  //       </List>
  //     )}
  //     <Box
  //       sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}
  //     >
  //       <Button onClick={previous}>BACK</Button>
  //       <Button onClick={onReviewed}>READY</Button>
  //     </Box>
  //   </Box>
  // );
};
