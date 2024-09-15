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

export const dispatchFetches = (
  courseId: string,
  setCourse: (resp: Response<Course>) => void,
  setFolders: (resp: Response<Folder[]>) => void,
  setQuizzes: (resp: Response<Quiz[]>) => void,
  setNews: (resp: Response<News[]>) => void,
): void => {
  setFolders({
    loading: true,
  });

  setQuizzes({
    loading: true,
  });

  setNews({
    loading: true,
  });

  setCourse({
    loading: true,
  });

  const token = store.getState().token.value;
  fetchFolders(token, courseId)
    .then((f) =>
      setFolders({
        data: f,
        loading: false,
      }),
    )
    .catch((e: unknown) =>
      setFolders({
        loading: false,
        error: unknownError(e),
      }),
    );

  fetchQuizzes(token, courseId)
    .then((f) =>
      setQuizzes({
        data: f.Objects,
        loading: false,
      }),
    )
    .catch((e: unknown) =>
      setQuizzes({
        loading: false,
        error: unknownError(e),
      }),
    );

  fetchAllNews(token, courseId)
    .then((f) =>
      setNews({
        data: f,
        loading: false,
      }),
    )
    .catch((e: unknown) =>
      setNews({
        loading: false,
        error: unknownError(e),
      }),
    );

  fetchCourse(token, courseId)
    .then((f) =>
      setCourse({
        data: f,
        loading: false,
      }),
    )
    .catch((e: unknown) =>
      setCourse({
        loading: false,
        error: unknownError(e),
      }),
    );
};
