import { lpBaseURL } from "./api";
import type { RichText } from "./api";
import { makeFetch, makeQuery } from "./utils";

export interface Course {
  Identifier: string;
  Name: string;
  Code: string;
  IsActive: boolean;
  CanSelfRegister: boolean;
  Description: RichText;
  Path: string;
  StartDate: string;
  EndDate: string;
  CourseTemplate: {
    Identifier: string;
    Name: string;
    Code: string;
  };
  Semester: {
    Identifier: string;
    Name: string;
    Code: string;
  };
  Department: {
    Identifier: string;
    Name: string;
    Code: string;
  };
}

export const useCourseQuery = makeQuery<Course, string>(
  lpBaseURL,
  (course: string) => `/courses/${course}`,
);

export const fetchCourse = makeFetch<Course, string>(
  lpBaseURL,
  (course: string) => `/courses/${course}`,
);
