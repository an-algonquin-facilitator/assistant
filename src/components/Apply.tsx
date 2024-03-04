import {
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  RichText,
  fetchFolder,
  fetchQuiz,
  updateFolder,
  updateQuiz,
} from "../api/api";
import { IPageProps } from "./Page";
import { useState } from "react";

import DoneIcon from "@mui/icons-material/Done";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import QuizIcon from "@mui/icons-material/Quiz";
import AssignmentIcon from "@mui/icons-material/Assignment";

interface APIError {
  title: string;
  detail: string;
}

enum TaskType {
  ASSIGNMENT,
  QUIZ,
}

interface Task {
  name: string;
  type: TaskType;
  loading: boolean;
  error?: APIError;
}

const toRichTextInput = (rt: RichText) => {
  return {
    Type: "HTML",
    Content: rt.Html,
  };
};

export const Apply = ({ next }: IPageProps) => {
  const plan = useSelector((state: RootState) => state.plan.value);
  const token = useSelector((state: RootState) => state.token.value);
  const [started, setStarted] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const apply = async () => {
    setStarted(true);
    setTasks([]);
    if (!plan || !token) return;

    for (const ass of plan.assignments) {
      setTasks((t) => [
        ...t,
        { name: ass.name, type: TaskType.ASSIGNMENT, loading: true },
      ]);
      const folder = await fetchFolder(token, [plan.id, ass.id]);
      folder.Availability.StartDate = new Date(ass.start).toISOString();
      folder.DueDate = new Date(ass.due).toISOString();
      folder.Availability.EndDate = new Date(ass.end).toISOString();
      const prom = await updateFolder(token, plan.id, ass.id, folder);
      const resp = await prom.json();
      const error =
        resp.status === 400
          ? { title: resp.title, detail: resp.detail }
          : undefined;
      setTasks((t) => [
        ...t.slice(0, t.length - 1),
        { ...t[t.length - 1], loading: false, error },
      ]);
    }
    for (const qu of plan.quizzes) {
      setTasks((t) => [
        ...t,
        { name: qu.name, type: TaskType.QUIZ, loading: true },
      ]);
      const quiz = await fetchQuiz(token, [plan.id, qu.id]);

      quiz.StartDate = new Date(qu.start).toISOString();
      quiz.DueDate = new Date(qu.due).toISOString();
      quiz.EndDate = new Date(qu.end).toISOString();
      {
        // The body for a PUT request is a little different. Seems like a bug tbh.
        const attempts = quiz.AttemptsAllowed.NumberOfAttemptsAllowed;
        const aQuiz = quiz as any;
        delete aQuiz.QuizId;
        delete aQuiz.AttemptsAllowed;
        delete aQuiz.ActivityId;
        aQuiz.NumberOfAttemptsAllowed = attempts;
        aQuiz.Instructions.Text = toRichTextInput(quiz.Instructions.Text);
        aQuiz.Description.Text = toRichTextInput(quiz.Description.Text);
        aQuiz.Header.Text = toRichTextInput(quiz.Header.Text);
        aQuiz.Footer.Text = toRichTextInput(quiz.Footer.Text);
      }
      console.log(quiz);

      const prom = await updateQuiz(token, plan.id, qu.id, quiz);
      const resp = await prom.json();
      const error =
        resp.status === 400
          ? { title: resp.title, detail: resp.detail }
          : undefined;
      setTasks((t) => [
        ...t.slice(0, t.length - 1),
        { ...t[t.length - 1], loading: false, error },
      ]);
    }
  };

  return (
    <Box>
      <Typography variant="h3">Ready to apply your plan?</Typography>
      {!started && (
        <Box sx={{ display: "flex", justifyContent: "center", m: 4 }}>
          <Button size="large" disabled={!plan || !token} onClick={apply}>
            Apply!
          </Button>
        </Box>
      )}

      {started && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {tasks.length > 0 && (
            <Table>
              <TableBody>
                {tasks.map((task, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      {task.loading && <CircularProgress size={20} />}
                      {!task.loading && !task.error && (
                        <DoneIcon sx={{ color: "green" }} />
                      )}
                      {task.error && (
                        <Tooltip
                          title={
                            <>
                              <Typography>{task.error.title}</Typography>
                              <Typography>{task.error.detail}</Typography>
                            </>
                          }
                        >
                          <ErrorOutlineIcon sx={{ color: "red" }} />
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        {task.type === TaskType.ASSIGNMENT ? (
                          <AssignmentIcon />
                        ) : (
                          <QuizIcon />
                        )}
                        &nbsp;
                        {task.name}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      )}
    </Box>
  );
};
