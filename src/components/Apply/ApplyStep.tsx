import { Box, Button, Table, TableBody, Typography } from "@mui/material";
import type { PageProps } from "../Assistant/Assistant";
import type { ReactElement } from "react";
import { useState } from "react";
import type { Task } from "./Task";
import { Ready } from "./Ready";

import { TaskRow } from "./TaskRow";
import { apply } from "./apply";

export const ApplyStep = ({ previous }: PageProps): ReactElement => {
  const [started, setStarted] = useState(false);
  const [complete, setComplete] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const onClick = (): void => {
    void apply({
      setStarted,
      setTasks,
      setComplete,
    });
  };

  return (
    <>
      {!started && <Ready onClick={onClick} />}
      {tasks.length > 0 && (
        <Table>
          <TableBody>
            {tasks.map((task, i) => (
              <TaskRow key={i} task={task} />
            ))}
          </TableBody>
        </Table>
      )}
      {complete && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            mt: 4,
          }}
        >
          <Typography variant="h4">Success</Typography>
          <Typography>Refresh the page to setup another class.</Typography>
        </Box>
      )}
      {!started && (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Button onClick={previous}>BACK</Button>
        </Box>
      )}
    </>
  );
};
