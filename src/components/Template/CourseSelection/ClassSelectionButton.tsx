import { Button } from "@mui/material";
import { SelectClassModal } from "./SelectClassModal";
import type { Enrollment } from "../../../api/enrollment";
import type { ReactElement } from "react";
import { useState } from "react";

interface ClassSelectionButtonProps {
  courseName: string;
  recent: Enrollment[];
  others: Enrollment[];
  onCourseSelected: (courseId: string) => void;
}

export const ClassSelectionButton = (
  props: ClassSelectionButtonProps,
): ReactElement => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Select course</Button>
      <SelectClassModal {...props} open={open} onClose={() => setOpen(false)} />
    </>
  );
};
