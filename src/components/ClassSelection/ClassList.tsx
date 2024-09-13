import { Button, List, ListItem } from "@mui/material";
import type { Enrollment } from "../../api/api";

interface ClassListProps {
  classes: Enrollment[];
  onClick: (id: string, name: string) => void;
}

export const ClassList = ({ classes, onClick }: ClassListProps) => {
  return (
    <List>
      {classes.map((c) => (
        <ListItem key={c.OrgUnit.Id}>
          <Button
            sx={{ width: "100%", justifyContent: "start" }}
            onClick={() => {
              onClick(c.OrgUnit.Id + "", c.OrgUnit.Name);
            }}
          >
            {c.OrgUnit.Name}
          </Button>
        </ListItem>
      ))}
    </List>
  );
};
