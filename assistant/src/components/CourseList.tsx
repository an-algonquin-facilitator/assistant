import {
  Button,
  CircularProgress,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { useEnrollmentsQuery } from "../api/api";
import { IPageProps } from "./Page";
import { useDispatch } from "react-redux";
import { setCurrentCourse } from "../store/currentCourse";
import { Template } from "./Template";

export const CourseList = ({ next }: IPageProps) => {
  const { data: enrollments, loading, error } = useEnrollmentsQuery();
  const dispatch = useDispatch();
  const facilitating = enrollments?.Items.filter(
    (e) =>
      e.Access.ClasslistRoleName === "Facilitator" &&
      e.OrgUnit.Type.Code === "Course Offering"
  );

  const editCourse = (courseId: string) => () => {
    dispatch(setCurrentCourse(courseId));
    next(Template);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography>Error loading courses {error}</Typography>;
  return (
    <>
      <Typography variant="h4" sx={{ py: 2 }}>
        Select course
      </Typography>
      <Typography>
        I have detected that you are facilitating the following courses. Please
        select the one you would like to modify:
      </Typography>
      <List>
        {facilitating?.map((f) => (
          <ListItem key={f.OrgUnit.Id}>
            <Button
              sx={{ width: "100%", justifyContent: "start" }}
              onClick={editCourse(f.OrgUnit.Id + "")}
            >
              {f.OrgUnit.Name}
            </Button>
          </ListItem>
        ))}
      </List>
    </>
  );
};
