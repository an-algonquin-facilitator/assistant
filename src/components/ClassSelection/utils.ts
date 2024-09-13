import type { Enrollment } from "../../api/api";
import {
  fetchAllNews,
  fetchCourse,
  fetchFolders,
  fetchQuizzes,
} from "../../api/api";
import { setCourse, setFolders, setNews, setQuizzes } from "../../store/course";
import { store } from "../../store/store";

export const sortClasses = (
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

const unknownError = (e: unknown): Error => {
  if (e instanceof Error) {
    return e;
  }
  return new Error(String(e));
};

export const dispatchFetches = (courseId: string): void => {
  store.dispatch(
    setFolders({
      loading: true,
    }),
  );
  store.dispatch(
    setQuizzes({
      loading: true,
    }),
  );
  store.dispatch(
    setNews({
      loading: true,
    }),
  );

  store.dispatch(
    setCourse({
      loading: true,
    }),
  );

  const token = store.getState().token.value;
  fetchFolders(token, courseId)
    .then((f) =>
      store.dispatch(
        setFolders({
          data: f,
          loading: false,
        }),
      ),
    )
    .catch((e: unknown) =>
      store.dispatch(
        setFolders({
          loading: false,
          error: unknownError(e),
        }),
      ),
    );

  fetchQuizzes(token, courseId)
    .then((f) =>
      store.dispatch(
        setQuizzes({
          data: f.Objects,
          loading: false,
        }),
      ),
    )
    .catch((e: unknown) =>
      store.dispatch(
        setQuizzes({
          loading: false,
          error: unknownError(e),
        }),
      ),
    );

  fetchAllNews(token, courseId)
    .then((f) =>
      store.dispatch(
        setNews({
          data: f,
          loading: false,
        }),
      ),
    )
    .catch((e: unknown) =>
      store.dispatch(
        setNews({
          loading: false,
          error: unknownError(e),
        }),
      ),
    );

  fetchCourse(token, courseId)
    .then((f) =>
      store.dispatch(
        setCourse({
          data: f,
          loading: false,
        }),
      ),
    )
    .catch((e: unknown) =>
      store.dispatch(
        setCourse({
          loading: false,
          error: unknownError(e),
        }),
      ),
    );
};
