import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { NewsPlan } from "../../store/plan";
import {
  addNewsPlan,
  removeNewsPlan,
  useIsAllNewsPlanned,
} from "../../store/plan";
import { NewsRow } from "./NewsRow";
import type { ReactElement } from "react";
import { AllPlannedCheckbox } from "./AllPlannedCheckbox";

interface NewsTabProps {
  news: NewsPlan[];
}

export const NewsPanel = ({ news }: NewsTabProps): ReactElement => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <AllPlannedCheckbox
              elems={news}
              add={addNewsPlan}
              remove={removeNewsPlan}
              useIsAllPlanned={useIsAllNewsPlanned}
            />
          </TableCell>
          <TableCell>
            <Typography>Name</Typography>
          </TableCell>
          <TableCell>
            <Typography>Start</Typography>
          </TableCell>
          <TableCell>
            <Typography>Dismiss</Typography>
          </TableCell>
          <TableCell>Content</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {news.map((n) => (
          <NewsRow key={n.name} news={n} />
        ))}
      </TableBody>
    </Table>
  );
};
