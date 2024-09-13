import QuizIcon from "@mui/icons-material/Quiz";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DeleteIcon from "@mui/icons-material/Delete";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { TaskType } from "./Task";
import type { ReactElement } from "react";

interface TaskIconProps {
  taskType: TaskType;
}

const iconMap: Record<TaskType, typeof AssignmentIcon> = {
  [TaskType.ASSIGNMENT]: AssignmentIcon,
  [TaskType.QUIZ]: QuizIcon,
  [TaskType.NEWS]: NotificationsActiveIcon,
  [TaskType.DELETE]: DeleteIcon,
};

export const TaskIcon = ({ taskType }: TaskIconProps): ReactElement => {
  const C = iconMap[taskType];
  return <C />;
};
