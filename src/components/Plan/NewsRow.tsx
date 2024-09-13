import {
  Checkbox,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { PlannedDate } from "./PlannedDate";
import type { INewsPlan } from "../../store/plan";
import {
  addNewsPlan,
  removeNewsPlan,
  useIsNewsPlanned,
} from "../../store/plan";
import { useAppDispatch } from "../../store/hooks";
import ArticleIcon from "@mui/icons-material/Article";
import { Modal } from "../Modal";
import type { ReactElement } from "react";
import { useState } from "react";

interface NewsRowProps {
  news: INewsPlan;
}

export const NewsRow = ({ news: n }: NewsRowProps): ReactElement => {
  const [open, setOpen] = useState(false);
  const isPlanned = useIsNewsPlanned(n.name);
  const dispatch = useAppDispatch();

  const onChange = (_: unknown, checked: boolean): void => {
    dispatch(checked ? addNewsPlan(n) : removeNewsPlan(n));
  };

  return (
    <TableRow>
      <TableCell>
        <Checkbox checked={isPlanned} onChange={onChange} />
      </TableCell>
      <TableCell>
        <Typography sx={{ textOverflow: "ellipsis" }}>{n.name}</Typography>
      </TableCell>
      <TableCell>
        <PlannedDate date={n.open} offset={n.openOffset} />
      </TableCell>
      <TableCell>
        <PlannedDate date={n.dismiss} offset={n.dismissOffset} />
      </TableCell>
      <TableCell>
        <IconButton onClick={() => setOpen(true)}>
          <ArticleIcon />
        </IconButton>
        <Modal open={open} onClose={() => setOpen(false)}>
          <Typography>
            <span dangerouslySetInnerHTML={{ __html: n.content }} />
          </Typography>
        </Modal>
      </TableCell>
    </TableRow>
  );
};
