import type { IModalProps } from "../../Modal";
import { Modal } from "../../Modal";
import type { Enrollment } from "../../../api/enrollment";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { CourseList } from "./CourseList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { ReactElement } from "react";

const Content = ({
  recent,
  others,
  onCourseSelected: onSelectCourse,
  onClose,
}: IProps): ReactElement => {
  const onClick = (courseId: string): void => {
    onSelectCourse(courseId);
    onClose();
  };

  return (
    <>
      <Typography variant="h4" sx={{ py: 2 }}>
        Select course
      </Typography>
      <Typography>
        I have detected that you are facilitating the following courses. Here
        are the most recent ones. Select the one would you like to modify:
      </Typography>
      <CourseList courses={recent} onClick={onClick} />
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Older courses you were facilitating
        </AccordionSummary>
        <AccordionDetails>
          <CourseList courses={others} onClick={onClick} />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

interface IProps extends IModalProps {
  recent: Enrollment[];
  others: Enrollment[];
  onCourseSelected: (courseId: string) => void;
}
export const SelectCourseModal = (props: IProps): ReactElement => {
  return (
    <Modal {...props}>
      <Content {...props} />
    </Modal>
  );
};
