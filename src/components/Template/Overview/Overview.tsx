import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { ReactElement } from "react";
import { AssignmentWarnings } from "./AssignmentWarnings";
import { QuizWarnings } from "./QuizWarnings";
import { NewsWarnings } from "./NewsWarnings";
import dayjs from "dayjs";
import {
  useCourse,
  useTemplateValidationResult,
} from "../../../store/template";

export const Overview = (): ReactElement => {
  const validationResult = useTemplateValidationResult();
  const course = useCourse();

  if (!course.course.Name) return <></>;

  if (!validationResult.isTemplateValid)
    return (
      <>
        <Typography>
          This template seemingly contains nothing. Check the documentation to
          make sure you setup your file correctly.
        </Typography>
      </>
    );

  return (
    <>
      <Typography sx={{ m: 2 }} variant="h4">
        {course.course.Name}
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Start: {dayjs(course.course.StartDate).toDate().toString()}
      </Typography>
      <Typography sx={{ mb: 2 }}>
        End: {dayjs(course.course.EndDate).toDate().toString()}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Template</TableCell>
            <TableCell>Brightspace</TableCell>
            <TableCell>Warnings</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Assignments</TableCell>
            <TableCell>{validationResult.validAssignments.length}</TableCell>
            <TableCell>{course.folders.length}</TableCell>
            <TableCell>
              <AssignmentWarnings template={validationResult} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Quizzes</TableCell>
            <TableCell>{validationResult.validQuizzes.length}</TableCell>
            <TableCell>{course.quizzes.length}</TableCell>
            <TableCell>
              <QuizWarnings template={validationResult} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>News</TableCell>
            <TableCell>{validationResult.validNews.length}</TableCell>
            <TableCell>{course.news.length}</TableCell>
            <TableCell>
              <NewsWarnings template={validationResult} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};
