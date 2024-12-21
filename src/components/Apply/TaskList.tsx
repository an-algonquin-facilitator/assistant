import type { ReactElement } from "react";
import { useHasTaskN } from "../../store/apply";
import { Table, TableBody } from "@mui/material";
import { TaskRow } from "./TaskRow";

export const TaskList = (): ReactElement => {
  const hasAnyTask = useHasTaskN(0);
  if (!hasAnyTask) return <></>;
  return (
    <Table>
      <TableBody>
        <TaskRow i={0} />
      </TableBody>
    </Table>
  );
};
