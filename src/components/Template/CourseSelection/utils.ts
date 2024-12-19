import type { Enrollment } from "../../../api/enrollment";
import { fetchAllNews } from "../../../api/news";
import { fetchQuizzes } from "../../../api/quiz";
import { fetchCourse } from "../../../api/course";
import { fetchFolders } from "../../../api/folder";
import { store } from "../../../store/store";
import type { Response } from "../../../api/utils";
import type { Course } from "../../../api/course";
import type { Folder } from "../../../api/folder";
import type { Quiz } from "../../../api/quiz";
import type { News } from "../../../api/news";
import type { Dispatch, SetStateAction } from "react";

export const sortCourses = (
  enrollments: Enrollment[],
): [Enrollment[], Enrollment[]] => {
  const facilitating = enrollments.filter(
    (e) =>
      e.Access.ClasslistRoleName === "Facilitator" &&
      e.OrgUnit.Type.Code === "Course Offering",
  );

  const maxDate = facilitating.reduce(
    (date, f) =>
      f.Access.StartDate.localeCompare(date) ? f.Access.StartDate : date,
    "",
  );

  const recent = facilitating.filter((f) => f.Access.StartDate === maxDate);
  const others = facilitating.filter((f) => f.Access.StartDate !== maxDate);
  return [recent, others];
};

const unknownError = (e: unknown): string => {
  if (e instanceof Error) {
    return e.message;
  }
  return String(e);
};

export interface FullCourseResponse {
  course: Response<Course>;
  folders: Response<Folder[]>;
  quizzes: Response<Quiz[]>;
  news: Response<News[]>;
}

export const dispatchFullCourseFetches = (
  courseId: string,
  setFullCourse: Dispatch<SetStateAction<FullCourseResponse>>,
): void => {
  setFullCourse({
    course: { loading: true },
    folders: { loading: true },
    quizzes: { loading: true },
    news: { loading: true },
  });

  const token = store.getState().token.value;
  fetchFolders(token, courseId)
    .then((f) =>
      setFullCourse((c) => ({
        ...c,
        folders: {
          data: f,
          loading: false,
        },
      })),
    )
    .catch((e: unknown) =>
      setFullCourse((c) => ({
        ...c,
        folders: {
          loading: false,
          error: unknownError(e),
        },
      })),
    );

  fetchQuizzes(token, courseId)
    .then((f) =>
      setFullCourse((c) => ({
        ...c,
        quizzes: {
          data: f.Objects,
          loading: false,
        },
      })),
    )
    .catch((e: unknown) =>
      setFullCourse((c) => ({
        ...c,
        quizzes: {
          loading: false,
          error: unknownError(e),
        },
      })),
    );

  fetchAllNews(token, courseId)
    .then((f) =>
      setFullCourse((c) => ({
        ...c,
        news: {
          data: f,
          loading: false,
        },
      })),
    )
    .catch((e: unknown) =>
      setFullCourse((c) => ({
        ...c,
        news: {
          loading: false,
          error: unknownError(e),
        },
      })),
    );

  fetchCourse(token, courseId)
    .then((f) =>
      setFullCourse((c) => ({
        ...c,
        course: {
          data: f,
          loading: false,
        },
      })),
    )
    .catch((e: unknown) =>
      setFullCourse((c) => ({
        ...c,
        course: {
          loading: false,
          error: unknownError(e),
        },
      })),
    );
};
