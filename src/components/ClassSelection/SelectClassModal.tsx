import type { IModalProps } from "../Modal";
import { Modal } from "../Modal";
import type { Enrollment } from "../../api/enrollment";
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
import type { Response } from "../../api/utils";
import type { Course } from "../../api/course";
import type { Folder } from "../../api/folder";
import type { Quiz } from "../../api/quiz";
import type { News } from "../../api/news";

const Content = ({
  enrollments,
  onClose,
  setCourse,
  setFolders,
  setQuizzes,
  setNews,
}: IProps): ReactElement => {
  const [recent, others] = sortClasses(enrollments);

  const onClick = (courseId: string): void => {
    dispatchFetches(courseId, setCourse, setFolders, setQuizzes, setNews);
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
      <ClassList courses={recent} onClick={onClick} />
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Older courses you were facilitating
        </AccordionSummary>
        <AccordionDetails>
          <ClassList courses={others} onClick={onClick} />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

interface IProps extends IModalProps {
  enrollments: Enrollment[];
  setCourse: (resp: Response<Course>) => void;
  setFolders: (resp: Response<Folder[]>) => void;
  setQuizzes: (resp: Response<Quiz[]>) => void;
  setNews: (resp: Response<News[]>) => void;
}
export const SelectClassModal = (props: IProps): ReactElement => {
  return (
    <Modal {...props}>
      <Content {...props} />
    </Modal>
  );
};
