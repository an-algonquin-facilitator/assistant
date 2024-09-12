import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  INewsPlan,
  addNewsPlan,
  removeNewsPlan,
  useIsAllNewsPlanned,
} from "../../store/plan";
import { useAppDispatch } from "../../store/hooks";
import { NewsRow } from "./NewsRow";

interface NewsTabProps {
  news: INewsPlan[];
}

export const NewsTab = ({ news }: NewsTabProps) => {
  const dispatch = useAppDispatch();
  const allPlanned = useIsAllNewsPlanned();

  const onCheck = (_: unknown, checked: boolean) => {
    const f = checked ? addNewsPlan : removeNewsPlan;
    news.forEach((a) => dispatch(f(a)));
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <Checkbox checked={allPlanned} onChange={onCheck} />
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
