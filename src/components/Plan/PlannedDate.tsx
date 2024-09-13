import { Tooltip, Typography } from "@mui/material";
import type { DateOffset } from "../../store/template";
import { dateOffsetToString, formatDate } from "../Review/utils";
import type { ReactElement } from "react";

interface PlannedDateProps {
  date: number;
  offset: DateOffset;
  holidayOffset?: number;
}

export const PlannedDate = ({
  date,
  offset,
  holidayOffset,
}: PlannedDateProps): ReactElement => {
  return (
    <Tooltip
      title={
        <Typography>{dateOffsetToString(offset, holidayOffset)}</Typography>
      }
    >
      <Typography>{formatDate(date)}</Typography>
    </Tooltip>
  );
};
