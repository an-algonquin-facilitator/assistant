import QuizIcon from "@mui/icons-material/Quiz";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DeleteIcon from "@mui/icons-material/Delete";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { TaskType } from "./Task";

interface TaskIconProps {
  taskType: TaskType;
}

const iconMap: Record<TaskType, OverridableComponent<any>> = {
  [TaskType.ASSIGNMENT]: AssignmentIcon,
  [TaskType.QUIZ]: QuizIcon,
  [TaskType.NEWS]: NotificationsActiveIcon,
  [TaskType.DELETE]: DeleteIcon,
};

export const TaskIcon = ({ taskType }: TaskIconProps) => {
  const C = iconMap[taskType];
  return <C />;
};
