import { Button, CircularProgress, Tooltip } from "@mui/material";
import { SelectClassModal } from "./SelectClassModal";
import { useEnrollmentsQuery } from "../../api/enrollment";
import type { Course } from "../../api/course";
import type { Response } from "../../api/utils";
import type { Folder } from "../../api/folder";
import type { Quiz } from "../../api/quiz";
import type { News } from "../../api/news";
import type { ReactElement } from "react";
import { useState } from "react";

interface ClassSelectionButtonProps {
  setCourse: (resp: Response<Course>) => void;
  setFolders: (resp: Response<Folder[]>) => void;
  setQuizzes: (resp: Response<Quiz[]>) => void;
  setNews: (resp: Response<News[]>) => void;
}

export const ClassSelectionButton = (
  props: ClassSelectionButtonProps,
): ReactElement => {
  const [open, setOpen] = useState(false);
  const { data: enrollments, loading, error } = useEnrollmentsQuery();

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <Tooltip title={error + "" || ""}>
          <Button disabled={error != null} onClick={() => setOpen(true)}>
            Select course
          </Button>
        </Tooltip>
      )}
      <SelectClassModal
        {...props}
        enrollments={enrollments?.Items ?? []}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};
