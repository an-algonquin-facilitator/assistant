import { useEffect, useState, type ReactElement } from "react";
import type { Response } from "../../../api/utils";
import type { Course } from "../../../api/course";
import type { Folder } from "../../../api/folder";
import type { Quiz } from "../../../api/quiz";
import type { News } from "../../../api/news";
import { ClassSelectionField } from "./ClassSelectionField";
import type { Enrollment } from "../../../api/enrollment";
import { dispatchFetches, sortClasses } from "./utils";
import type { SelectedCourse } from "../../../store/course";

interface CourseSelectionProps {
  enrollments: Enrollment[];
  courseCode: string;
  onCourseSelected: (course: SelectedCourse) => void;
}

export const CourseSelection = (props: CourseSelectionProps): ReactElement => {
  const [recent, others] = sortClasses(props.enrollments);

  const [course, setCourse] = useState<Response<Course>>({ loading: false });
  const [folders, setFolders] = useState<Response<Folder[]>>({
    loading: false,
  });
  const [quizzes, setQuizzes] = useState<Response<Quiz[]>>({
    loading: false,
  });
  const [news, setNews] = useState<Response<News[]>>({ loading: false });

  const selectCourse = (courseId: string): void => {
    dispatchFetches(courseId, setCourse, setFolders, setQuizzes, setNews);
  };

  useEffect(() => {
    const prefered = recent.find((c) =>
      c.OrgUnit.Code.includes(props.courseCode),
    );
    if (!prefered) return;
    selectCourse(prefered.OrgUnit.Id + "");
  }, []);

  useEffect(() => {
    if (
      course.loading ||
      folders.loading ||
      quizzes.loading ||
      news.loading ||
      course.error !== undefined ||
      folders.error !== undefined ||
      quizzes.error !== undefined ||
      news.error !== undefined ||
      course.data === undefined ||
      folders.data === undefined ||
      quizzes.data === undefined ||
      news.data === undefined
    ) {
      return;
    }
    props.onCourseSelected({
      course: course.data,
      folders: folders.data,
      quizzes: quizzes.data,
      news: news.data,
    });
  }, [course, folders, quizzes, news]);

  return (
    <ClassSelectionField
      courseName={course.data?.Name ?? "None"}
      recent={recent}
      others={others}
      onCourseSelected={selectCourse}
    />
  );
};
