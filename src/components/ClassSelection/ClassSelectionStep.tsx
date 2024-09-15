import { Box, Button } from "@mui/material";
import type { PageProps } from "../Assistant/Assistant";
import { ClassSelectionField } from "./ClassSelectionField";
import { ClassSummary } from "./ClassSummary";
import { resetCourse } from "../../store/course";
import { useAppDispatch } from "../../store/hooks";
import { useState, type ReactElement } from "react";
import type { Response } from "../../api/utils";
import type { Course } from "../../api/course";
import type { Folder } from "../../api/folder";
import type { Quiz } from "../../api/quiz";
import type { News } from "../../api/news";
import { setCourse as dSetCourse } from "../../store/course";

export const ClassSelectionStep = ({
  previous,
  next,
}: PageProps): ReactElement => {
  const [course, setCourse] = useState<Response<Course>>({ loading: false });
  const [folders, setFolders] = useState<Response<Folder[]>>({
    loading: false,
  });
  const [quizzes, setQuizzes] = useState<Response<Quiz[]>>({ loading: false });
  const [news, setNews] = useState<Response<News[]>>({ loading: false });
  const dispatch = useAppDispatch();

  const ready =
    course.data !== undefined &&
    !course.loading &&
    course.error === undefined &&
    folders.data !== undefined &&
    !folders.loading &&
    folders.error === undefined &&
    quizzes.data !== undefined &&
    !quizzes.loading &&
    quizzes.error === undefined &&
    news.data !== undefined &&
    !news.loading &&
    news.error === undefined;

  const onPrevious = (): void => {
    dispatch(resetCourse());
    previous();
  };

  const onNext = (): void => {
    if (!course.data || !folders.data || !quizzes.data || !news.data) return;
    dispatch(
      dSetCourse({
        course: course.data,
        folders: folders.data,
        quizzes: quizzes.data,
        news: news.data,
      }),
    );
    next();
  };

  return (
    <>
      <ClassSelectionField
        course={course}
        setCourse={setCourse}
        setFolders={setFolders}
        setQuizzes={setQuizzes}
        setNews={setNews}
      />
      <ClassSummary
        course={course}
        folders={folders}
        quizzes={quizzes}
        news={news}
      />
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
