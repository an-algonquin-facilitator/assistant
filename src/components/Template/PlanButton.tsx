import type { ReactElement } from "react";
import { useIsTemplateValid } from "../../store/templateStep";
import { useAppDispatch } from "../../store/hooks";
import { setCourse as dSetCourse } from "../../store/course";
import { setTemplate } from "../../store/template";
import { Button } from "@mui/material";
import { store } from "../../store/store";

interface PlanButtonProps {
  onClick: () => void;
}

export const PlanButton = ({ onClick }: PlanButtonProps): ReactElement => {
  const dispatch = useAppDispatch();
  const isValid = useIsTemplateValid();

  const onNext = (): void => {
    const { file } = store.getState().templateStep;
    const { validatedTemplate } = store.getState().templateStep;
    const { course } = store.getState().templateStep;
    if (!isValid || !file || !course.data) return;
    dispatch(
      setTemplate({
        courseCode: file.template.courseCode,
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
