import type { Enrollment } from "../../../api/enrollment";
import { fetchAllNews } from "../../../api/news";
import { fetchQuizzes } from "../../../api/quiz";
import { fetchCourse } from "../../../api/course";
import { fetchFolders } from "../../../api/folder";
import { fetchAllTopics } from "../../../api/discussion";
import { fetchAllAgents } from "../../../api/agent";
import { fetchCourseRoles } from "../../../api/classlist";
import { store } from "../../../store/store";
import type { useAppDispatch } from "../../../store/hooks";
import {
  courseRequestError,
  courseRequestStarted,
  courseRequestSuccess,
} from "../../../store/template";

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
      f.Access.StartDate.localeCompare(date) > 0 ? f.Access.StartDate : date,
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

interface Soft<T> {
  value: T;
  error?: string;
}

// Intelligent agents and the classlist need newer API versions than the rest
// of the course. When they fail, keep the course usable and remember why.
const softFetch = async <T>(p: Promise<T>, fallback: T): Promise<Soft<T>> =>
  p
    .then((value) => ({ value }))
    .catch((e: unknown) => ({ value: fallback, error: unknownError(e) }));

export const dispatchFullCourseFetches = (
  courseId: string,
  dispatch: ReturnType<typeof useAppDispatch>,
): void => {
  dispatch(courseRequestStarted());

  const token = store.getState().token.value;

  const p = Promise.all([
    fetchFolders(token, courseId),
    fetchQuizzes(token, courseId),
    fetchAllNews(token, courseId),
    fetchAllTopics(token, courseId),
    fetchCourse(token, courseId),
    softFetch(fetchAllAgents(token, courseId), []),
    softFetch(fetchCourseRoles(token, courseId), []),
  ]);

  p.then(([folders, quizzes, news, topics, course, agents, roles]) => {
    dispatch(
      courseRequestSuccess({
        folders,
        quizzes: quizzes.Objects,
        news,
        topics,
        course,
        agents: agents.value,
        roles: roles.value,
        agentsError: agents.error ?? roles.error,
      }),
    );
  }).catch((e: unknown) => dispatch(courseRequestError(unknownError(e))));
};
