import { Button } from "@mui/material";
import { SelectCourseModal } from "./SelectCourseModal";
import type { Enrollment } from "../../../api/enrollment";
import type { ReactElement } from "react";
import { useState } from "react";

interface CourseSelectionButtonProps {
  courseName: string;
  recent: Enrollment[];
  others: Enrollment[];
  onCourseSelected: (courseId: string) => void;
}

export const CourseSelectionButton = (
  props: CourseSelectionButtonProps,
): ReactElement => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Select course</Button>
      <SelectCourseModal
        {...props}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};
