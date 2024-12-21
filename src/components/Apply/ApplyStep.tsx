import type { PageProps } from "../Assistant/Assistant";
import type { ReactElement } from "react";
import { Ready } from "./Ready";

import { TaskList } from "./TaskList";
import { BackButton } from "./BackButton";
import { SuccessMessage } from "./SuccessMessage";

export const ApplyStep = (props: PageProps): ReactElement => {
  return (
    <>
      <Ready />
      <TaskList />
      <SuccessMessage />
      <BackButton {...props} />
    </>
  );
};
