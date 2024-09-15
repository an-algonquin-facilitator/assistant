import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { ValidatedTemplate } from "../utils";
import { isValidTemplate } from "../utils";
import type { ReactElement } from "react";
import type { SelectedCourse } from "../../../store/course";
import { AssignmentWarnings } from "./AssignmentWarnings";
import { QuizWarnings } from "./QuizWarnings";
import { NewsWarnings } from "./NewsWarnings";
import dayjs from "dayjs";

interface OverviewProps {
  template: ValidatedTemplate;
  course: SelectedCourse;
}

export const Overview = ({ template, course }: OverviewProps): ReactElement => {
  const isValid = isValidTemplate(template);

  if (!isValid)
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
            <TableCell>{template.validAssignments.length}</TableCell>
            <TableCell>{course.folders.length}</TableCell>
            <TableCell>
              <AssignmentWarnings template={template} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Quizzes</TableCell>
            <TableCell>{template.validQuizzes.length}</TableCell>
            <TableCell>{course.quizzes.length}</TableCell>
            <TableCell>
              <QuizWarnings template={template} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>News</TableCell>
            <TableCell>{template.validNews.length}</TableCell>
            <TableCell>{course.news.length}</TableCell>
            <TableCell>
              <NewsWarnings template={template} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};
