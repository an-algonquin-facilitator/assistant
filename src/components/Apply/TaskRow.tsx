import { TableCell, TableRow, Tooltip, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { TaskIcon } from "./TaskIcon";
import type { Task } from "./Task";
import type { ReactElement } from "react";
import { Loading } from "../Loading";
interface TaskRowProps {
  task: Task;
}

export const TaskRow = ({ task }: TaskRowProps): ReactElement => {
  return (
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
  );
};
