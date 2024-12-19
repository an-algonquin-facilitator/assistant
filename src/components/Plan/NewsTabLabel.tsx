import type { ReactElement } from "react";
import { usePlanedNewsCount } from "../../store/plan";
import { useTemplateNewsCount } from "../../store/template";

export const NewsTabLabel = (): ReactElement => {
  const plannedNewsCount = usePlanedNewsCount();
  const templateNewsCount = useTemplateNewsCount();
  return (
    <>
      News ({plannedNewsCount}/{templateNewsCount})
    </>
  );
};
