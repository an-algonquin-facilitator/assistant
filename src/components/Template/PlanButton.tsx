import type { ReactElement } from "react";
import {
  useIsTemplateValid,
  useSelectedCourse,
  useTemplateFile,
  useValidatedTemplate,
} from "../../store/templateStep";
import { useAppDispatch } from "../../store/hooks";
import { setCourse as dSetCourse } from "../../store/course";
import { setTemplate } from "../../store/template";
import { Button } from "@mui/material";

interface PlanButtonProps {
  onClick: () => void;
}

export const PlanButton = ({ onClick }: PlanButtonProps): ReactElement => {
  const dispatch = useAppDispatch();
  const templateFile = useTemplateFile();
  const validatedTemplate = useValidatedTemplate();
  const isValid = useIsTemplateValid();
  const course = useSelectedCourse();
  const onNext = (): void => {
    if (!isValid || !templateFile || !course.data) return;
    dispatch(
      setTemplate({
        courseCode: templateFile.template.courseCode,
        assignments: validatedTemplate.validAssignments,
        quizzes: validatedTemplate.validQuizzes,
        news: validatedTemplate.validNews,
      }),
    );
    dispatch(dSetCourse(course.data));
    onClick();
  };
  return (
    <Button onClick={onNext} disabled={!isValid}>
      PLAN
    </Button>
  );
};
