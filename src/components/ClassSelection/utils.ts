import type { Enrollment, MyEnrollments } from "../../api/api";
import {
  fetchAllNews,
  fetchCourse,
  fetchFolders,
  fetchQuizzes,
} from "../../api/api";
import { setCourse, setFolders, setNews, setQuizzes } from "../../store/course";
import { store } from "../../store/store";

export const sortClasses = (
  enrollments: MyEnrollments,
): [Enrollment[], Enrollment[]] => {
  const facilitating = enrollments.Items.filter(
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
    .catch((e) =>
      store.dispatch(
        setFolders({
          loading: false,
          error: e,
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
    .catch((e) =>
      store.dispatch(
        setQuizzes({
          loading: false,
          error: e,
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
    .catch((e) =>
      store.dispatch(
        setNews({
          loading: false,
          error: e,
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
    .catch((e) =>
      store.dispatch(
        setCourse({
          loading: false,
          error: e,
        }),
      ),
    );
};
