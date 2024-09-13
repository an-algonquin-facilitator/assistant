import type { IModalProps } from "../Modal";
import { Modal } from "../Modal";
import type { Enrollment } from "../../api/api";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { dispatchFetches, sortClasses } from "./utils";
import { ClassList } from "./ClassList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { ReactElement } from "react";

const Content = ({ enrollments, onClose }: IProps): ReactElement => {
  const [recent, others] = sortClasses(enrollments);

  const onClick = (courseId: string): void => {
    dispatchFetches(courseId);
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
      <ClassList classes={recent} onClick={onClick} />
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Older classes you were facilitating
        </AccordionSummary>
        <AccordionDetails>
          <ClassList classes={others} onClick={onClick} />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

interface IProps extends IModalProps {
  enrollments: Enrollment[];
}
export const SelectClassModal = (props: IProps): ReactElement => {
  return (
    <Modal {...props}>
      <Content {...props} />
    </Modal>
  );
};
