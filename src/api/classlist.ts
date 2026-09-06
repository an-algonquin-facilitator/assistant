// https://docs.valence.desire2learn.com/res/enroll.html#get--d2l-api-le-(version)-(orgUnitId)-classlist-
import { leAgentsBaseURL } from "./api";
import { makeFetch } from "./utils";

export interface ClasslistUser {
  Identifier: string;
  ProfileIdentifier: string;
  DisplayName: string;
  Username: string | null;
  OrgDefinedId: string | null;
  Email: string | null;
  FirstName: string | null;
  LastName: string | null;
  RoleId: number | null;
  LastAccessed: string | null;
  IsOnline: boolean;
  ClasslistRoleDisplayName: string;
  Pronouns: string | null;
}

export interface CourseRole {
  id: number;
  name: string;
}

export const fetchClasslist = makeFetch<ClasslistUser[], string>(
  leAgentsBaseURL,
  (course: string) => `/${course}/classlist/`,
);

// There is no route listing roles, so the distinct roles of the people
// enrolled in the course are the only way to map a role name to its id.
export const fetchCourseRoles = async (
  token: string,
  course: string,
): Promise<CourseRole[]> => {
  const users = await fetchClasslist(token, course);
  if (!Array.isArray(users)) {
    throw new Error(`Unexpected classlist response: ${JSON.stringify(users)}`);
  }
  const roles = new Map<number, string>();
  for (const u of users) {
    if (u.RoleId !== null && !roles.has(u.RoleId)) {
      roles.set(u.RoleId, u.ClasslistRoleDisplayName);
    }
  }
  return Array.from(roles.entries()).map(([id, name]) => ({ id, name }));
};
