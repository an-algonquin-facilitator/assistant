import { Typography } from "@mui/material";
import { useTemplate } from "../../store/template";
import { isValidTemplate } from "./utils";
import { useFolderCount, useNewsCount, useQuizCount } from "../../store/course";
import { Specification } from "./Specification";

export const TemplateOverview = () => {
  const template = useTemplate();
  const folderCount = useFolderCount();
  const quizCount = useQuizCount();
  const newsCount = useNewsCount();

  const isEmpty = Object.getOwnPropertyNames(template).length === 0;
  if (isEmpty) return <></>;

  const valid = isValidTemplate(template);

  if (!valid)
    return (
      <>
        <Typography>
          This template seemingly contains nothing. Check the documentation to
          make sure you setup your file correctly.
        </Typography>
      </>
    );

  const aCount = template?.assignments?.length ?? 0;
  const qCount = template?.quizzes?.length ?? 0;
  const nCount = template?.news?.length ?? 0;

  return (
    <>
      <Typography variant="h4">
        This template contains specification for:
      </Typography>
      <Specification
        templateCount={aCount}
        classCount={folderCount}
        resourceName={"assignment"}
      />
      <Specification
        templateCount={qCount}
        classCount={quizCount}
        resourceName={"quizzes"}
      />
      <Specification
        templateCount={nCount}
        classCount={newsCount}
        resourceName={"announcements"}
      />
    </>
  );
};
