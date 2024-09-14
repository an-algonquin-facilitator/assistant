import { lpBaseURL } from "./api";
import { makeFetch, makeQuery } from "./utils";

export interface MyEnrollments {
  PagingInfo: {
    Bookmark: string;
    HasMoreItems: boolean;
  };
  Items: Enrollment[];
}

export interface Enrollment {
  OrgUnit: {
    Id: number;
    Type: {
      Id: number;
      Code: string;
      Name: string;
    };
    Name: string;
    Code: string;
  };
  Access: {
    IsActive: true;
    StartDate: string;
    EndDate: string;
    CanAccess: boolean;
    ClasslistRoleName: string;
    LISRoles: string[];
    LastAccessed: string;
  };
}

export const useEnrollmentsQuery = makeQuery<MyEnrollments, void>(
  lpBaseURL,
  () => `/enrollments/myenrollments/`,
);

export const fetchEnrollments = makeFetch<MyEnrollments, void>(
  lpBaseURL,
  () => `/enrollments/myenrollments/`,
);
