import type { ReactElement } from "react";
import { usePlanedDiscussionCount } from "../../store/plan";
import { useTemplateDiscussionsCount } from "../../store/template";

export const DiscussionsTabLabel = (): ReactElement => {
  const plannedDiscussionCount = usePlanedDiscussionCount();
  const templateDiscussionCount = useTemplateDiscussionsCount();
  return (
    <>
      Discussions ({plannedDiscussionCount}/{templateDiscussionCount})
    </>
  );
};
