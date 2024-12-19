import type { Enrollment } from "../../../api/enrollment";
import { fetchAllNews } from "../../../api/news";
import { fetchQuizzes } from "../../../api/quiz";
import { fetchCourse } from "../../../api/course";
import { fetchFolders } from "../../../api/folder";
import { store } from "../../../store/store";
import type { Response } from "../../../api/utils";
import type { SelectedCourse } from "../../../store/course";

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

export const dispatchFullCourseFetches = (
  courseId: string,
  setCourse: (c: Response<SelectedCourse>) => void,
): void => {
  setCourse({ loading: true });

  const token = store.getState().token.value;

  const p = Promise.all([
    fetchFolders(token, courseId),
    fetchQuizzes(token, courseId),
    fetchAllNews(token, courseId),
    fetchCourse(token, courseId),
  ]);

  p.then(([folders, quizzes, news, course]) =>
    setCourse({
      data: {
        folders,
        quizzes: quizzes.Objects,
        news,
        course,
      },
      loading: false,
    }),
  ).catch((e: unknown) =>
    setCourse({ loading: false, error: unknownError(e) }),
  );
};
