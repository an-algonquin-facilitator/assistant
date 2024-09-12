import { Tooltip, Typography } from "@mui/material";
import { DateOffset } from "../../store/template";

const dateOffsetToString = (offset: DateOffset, holidayOffset?: number) => {
  let str = "semester start";
  if (offset.weeks) str += ` + ${offset.weeks} weeks`;
  if (offset.days) str += ` + ${offset.days} days`;
  if (holidayOffset) str += ` + ${holidayOffset} holidays`;
  return str;
};

const formatDate = (unix: number) => {
  return new Date(unix).toLocaleString().replaceAll(" ", "\u00A0");
};

interface PlannedDateProps {
  date: number;
  offset: DateOffset;
  holidayOffset?: number;
}

export const PlannedDate = ({
  date,
  offset,
  holidayOffset,
}: PlannedDateProps) => {
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
