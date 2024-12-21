import { TableCell, TableRow, Tooltip, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { TaskIcon } from "./TaskIcon";
import type { ReactElement } from "react";
import { Loading } from "../Loading";
import { useHasTaskN, useTask } from "../../store/apply";

interface TaskRowProps {
  i: number;
}

export const TaskRow = ({ i }: TaskRowProps): ReactElement => {
  const hasTask = useHasTaskN(i);
  const task = useTask(i);

  if (!hasTask) return <></>;
  return (
    <>
      <TableRow>
        <TableCell>
          {task.loading && <Loading size={20} />}
          {!task.loading && !task.error && <DoneIcon sx={{ color: "green" }} />}
          {task.error && (
            <Tooltip
              title={
                <>
                  <Typography>{task.error.title}</Typography>
                  <Typography>{task.error.detail}</Typography>
                </>
              }
            >
              <ErrorOutlineIcon sx={{ color: "red" }} />
            </Tooltip>
          )}
        </TableCell>
        <TableCell>
          <Typography sx={{ display: "flex", alignItems: "center" }}>
            <TaskIcon taskType={task.type} />
            &nbsp;
            {task.name}
          </Typography>
        </TableCell>
      </TableRow>
      <TaskRow i={i + 1} />
    </>
  );
};
