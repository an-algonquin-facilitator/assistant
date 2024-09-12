import { IModalProps, Modal } from "../Modal";
import { MyEnrollments } from "../../api/api";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { dispatchFetches, sortClasses } from "./utils";
import { ClassList } from "./ClassList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Content = ({ myEnrollments, onClose }: IProps) => {
  const [recent, others] = sortClasses(myEnrollments);

  const onClick = (courseId: string, name: string) => {
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
  myEnrollments: MyEnrollments;
}
export const SelectClassModal = (props: IProps) => {
  return (
    <Modal {...props}>
      <Content {...props} />
    </Modal>
  );
};
