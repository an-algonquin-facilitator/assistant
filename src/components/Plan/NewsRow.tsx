import { TableCell, TableRow, Typography } from "@mui/material";
import { PlannedDate } from "./PlannedDate";
import type { NewsPlan } from "../../store/plan";
import {
  addNewsPlan,
  removeNewsPlan,
  useIsNewsPlanned,
} from "../../store/plan";
import type { ReactElement } from "react";
import { PlanCheckbox } from "./PlanCheckbox";
import { NewsContentButton } from "./NewsContentButton";

interface NewsRowProps {
  news: NewsPlan;
}

export const NewsRow = ({ news: n }: NewsRowProps): ReactElement => {
  return (
    <TableRow>
      <TableCell>
        <PlanCheckbox
          id={n.name}
          elem={n}
          add={addNewsPlan}
          remove={removeNewsPlan}
          useIsPlanned={useIsNewsPlanned}
        />
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
        <NewsContentButton news={n} />
      </TableCell>
    </TableRow>
  );
};
