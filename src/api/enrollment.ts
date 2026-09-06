import { useState } from "react";
import { lpBaseURL, StatusOK } from "./api";
import { useToken } from "../store/token";
import type { Response } from "./utils";

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

const enrollmentsPath = "/enrollments/myenrollments/";

const fetchEnrollmentsPage = async (
  token: string,
  bookmark: string,
): Promise<MyEnrollments> => {
  const url =
    lpBaseURL +
    enrollmentsPath +
    (bookmark ? `?bookmark=${encodeURIComponent(bookmark)}` : "");
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = (await resp.json()) as MyEnrollments;
  if (resp.status !== StatusOK) {
    throw body;
  }
  return body;
};

// myenrollments is bookmark-paginated and the API orders results by last-
// accessed, so a newly-assigned course can land on a later page. Follow the
// bookmark until HasMoreItems is false so callers see every enrollment.
export const fetchAllEnrollments = async (
  token: string,
): Promise<MyEnrollments> => {
  const items: Enrollment[] = [];
  let bookmark = "";
  for (;;) {
    const page = await fetchEnrollmentsPage(token, bookmark);
    items.push(...page.Items);
    if (!page.PagingInfo.HasMoreItems) {
      return {
        PagingInfo: { Bookmark: "", HasMoreItems: false },
        Items: items,
      };
    }
    bookmark = page.PagingInfo.Bookmark;
  }
};

export const useEnrollmentsQuery = (): Response<MyEnrollments> => {
  const [resp, setResp] = useState<Response<MyEnrollments>>({ loading: true });
  const token = useToken();

  if (!token || !resp.loading) return resp;

  fetchAllEnrollments(token)
    .then((data) => setResp({ data, loading: false }))
    .catch((e: unknown) =>
      setResp({ loading: false, error: JSON.stringify(e) }),
    );

  return resp;
};
