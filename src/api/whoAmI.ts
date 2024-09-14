import { lpBaseURL } from "./api";

import { makeFetch, makeQuery } from "./utils";

export const useWhoAmIQuery = makeQuery<WhoAmI, void>(
  lpBaseURL,
  () => `/users/whoami`,
);
export const fetchWhoAmI = makeFetch<WhoAmI, void>(
  lpBaseURL,
  () => `/users/whoami`,
);

export interface WhoAmI {
  Identifier: string;
  FirstName: string;
  LastName: string;
  UniqueName: string;
  Pronouns: string;
  ProfileIdentifier: string;
}
