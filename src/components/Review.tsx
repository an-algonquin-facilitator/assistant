import {
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { IPageProps } from "./Page";
import { useDispatch, useSelector } from "react-redux";
import { useCourseQuery, useFoldersQuery, useQuizzesQuery } from "../api/api";
import { RootState } from "../store/store";
import dayjs from "dayjs";
import { IAssignmentPlan, IQuizPlan, setPlan } from "../store/plan";
import { Apply } from "./Apply";
import { DateOffset } from "../store/template";
import { Template } from "./Template";
import { isDefined } from "../utils";
import { ListWarnings } from "./ListWarnings";
import { ReviewAssignment } from "./ReviewAssignment";
import { ReviewQuiz } from "./ReviewQuiz";

const calculateDate = (
  start: number,
  offset: DateOffset,
  startOfDay: boolean
) => {
  let d = dayjs(start);
  if (offset.weeks) d = d.add(offset.weeks, "week");
  if (offset.days) d = d.add(offset.days, "day");
  if (startOfDay) d = d.startOf("day").add(1, "minute");
  else d = d.startOf("day").add(23, "hour").add(59, "minute");
  return d.unix() * 1000;
};

export const ReviewTemplate = ({ next }: IPageProps) => {
  const courseId = useSelector((state: RootState) => state.currentCourse.value);
  const { data: folders, loading: foldersLoading } = useFoldersQuery(courseId);
  const { data: quizzes, loading: quizzesLoading } = useQuizzesQuery(courseId);
  const { data: course, loading: courseLoading } = useCourseQuery(courseId);
  const template = useSelector((state: RootState) => state.template);
  const dispatch = useDispatch();
  const ass = template.data.assignments ?? [];
  const qu = template.data.quizzes ?? [];
  if (
    courseLoading ||
    foldersLoading ||
    quizzesLoading ||
    !course ||
    !folders ||
    !quizzes
  )
    return <CircularProgress />;
  const plan = {
    id: courseId,
    name: course.Name,
    quizzes: qu
      .map((q): IQuizPlan | undefined => {
        const bQ = quizzes.Objects.find((b) => b.Name === q.name);
        if (!bQ) return undefined;
        const defaultEndOffset = {
          days: q.due.days ?? 0,
          weeks: (q.due.weeks ?? 0) + 1,
        };
        return {
          id: bQ.QuizId + "",
          name: bQ.Name,
          start: calculateDate(template.startDateUnixMS, q.start ?? {}, true),
          due: calculateDate(template.startDateUnixMS, q.due, false),
          end: calculateDate(
            template.startDateUnixMS,
            q.end ?? defaultEndOffset,
            false
          ),

          startOffset: q.start ?? {},
          dueOffset: q.due,
          endOffset: q.end ?? defaultEndOffset,
        };
      })
      .filter(isDefined),
    assignments: ass
      .map((a): IAssignmentPlan | undefined => {
        const f = folders.find((f) => f.Name === a.name);
        if (!f) return undefined;
        const defaultEndOffset = {
          days: a.due.days ?? 0,
          weeks: (a.due.weeks ?? 0) + 1,
        };
        return {
          id: f.Id + "",
          name: f.Name,
          start: calculateDate(template.startDateUnixMS, a.start ?? {}, true),
          due: calculateDate(template.startDateUnixMS, a.due, false),
          end: calculateDate(
            template.startDateUnixMS,
            a.end ?? defaultEndOffset,
            false
          ),

          startOffset: a.start ?? {},
          dueOffset: a.due,
          endOffset: a.end ?? defaultEndOffset,
        };
      })
      .filter(isDefined),
  };
  const onReviewed = () => {
    next(Apply);
    dispatch(setPlan(plan));
  };

  const missingAssignmentsBrightspace = folders.filter(
    (f) => !ass.some((a) => a.name === f.Name)
  );
  const missingAssignmentsTemplate = ass.filter(
    (f) => !folders.some((a) => a.Name === f.name)
  );

  const missingQuizzesBrightspace = quizzes.Objects.filter(
    (b) => !qu.some((q) => q.name === b.Name)
  );
  const missingQuizzesTemplate = qu.filter(
    (q) => !quizzes.Objects.some((b) => b.Name === q.name)
  );

  return (
    <Box>
      <Typography variant="h3">Review</Typography>
      <Typography variant="h4">
        {course?.Name} ({courseId})
      </Typography>
      <ListWarnings
        explanation="The following assignments were found in Brightspace but not in your
            template. They will not be modified."
        warnings={missingAssignmentsBrightspace.map((m) => m.Name)}
      />
      <ListWarnings
        explanation="The following assignments were found in your template but not in
        Brightspace. It will not be applied."
        warnings={missingAssignmentsTemplate.map((m) => m.name)}
      />
      <ListWarnings
        explanation="The following assignments were found in Brightspace but not in your
            template. They will not be modified."
        warnings={missingQuizzesBrightspace.map((m) => m.Name)}
      />
      <ListWarnings
        explanation="The following assignments were found in your template but not in
        Brightspace. It will not be applied."
        warnings={missingQuizzesTemplate.map((m) => m.name)}
      />
      {plan.assignments.length > 0 && (
        <List>
          {plan.assignments.map((a) => (
            <ListItem
              key={a.name}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
              }}
            >
              <ReviewAssignment assignment={a} />
            </ListItem>
          ))}
        </List>
      )}
      {plan.quizzes.length > 0 && (
        <List>
          {plan.quizzes.map((a) => (
            <ListItem
              key={a.name}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
              }}
            >
              <ReviewQuiz quiz={a} />
            </ListItem>
          ))}
        </List>
      )}
      <Box
        sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}
      >
        <Button onClick={() => next(Template)}>BACK</Button>
        <Button onClick={onReviewed}>READY</Button>
      </Box>
    </Box>
  );
};
