import { Button, List, ListItem } from "@mui/material";
import type { Enrollment } from "../../api/enrollment";
import type { ReactElement } from "react";

interface ClassListProps {
  courses: Enrollment[];
  onClick: (id: string) => void;
}

export const ClassList = ({
  courses,
  onClick,
}: ClassListProps): ReactElement => {
  return (
    <List>
      {courses.map((c) => (
        <ListItem key={c.OrgUnit.Id}>
          <Button
            sx={{ width: "100%", justifyContent: "start" }}
            onClick={() => {
              onClick(c.OrgUnit.Id + "");
            }}
          >
            {c.OrgUnit.Name}
          </Button>
        </ListItem>
      ))}
    </List>
  );
};
