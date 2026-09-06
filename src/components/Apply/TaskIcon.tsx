import QuizIcon from "@mui/icons-material/Quiz";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ForumIcon from "@mui/icons-material/Forum";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import type { ReactElement } from "react";
import { TaskType } from "../../store/apply";

interface TaskIconProps {
  taskType: TaskType;
}

const iconMap: Record<TaskType, typeof AssignmentIcon> = {
  [TaskType.ASSIGNMENT]: AssignmentIcon,
  [TaskType.QUIZ]: QuizIcon,
  [TaskType.DISCUSSION]: ForumIcon,
  [TaskType.NEWS]: NotificationsActiveIcon,
};

export const TaskIcon = ({ taskType }: TaskIconProps): ReactElement => {
  const C = iconMap[taskType];
  return <C />;
};
