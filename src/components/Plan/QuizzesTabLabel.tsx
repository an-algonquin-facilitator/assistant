import type { ReactElement } from "react";
import { usePlanedQuizCount } from "../../store/plan";
import { useTemplateQuizzesCount } from "../../store/template";

export const QuizzesTabLabel = (): ReactElement => {
  const plannedQuizCount = usePlanedQuizCount();
  const templateQuizCount = useTemplateQuizzesCount();
  return (
    <>
      Quizzes ({plannedQuizCount}/{templateQuizCount})
    </>
  );
};
