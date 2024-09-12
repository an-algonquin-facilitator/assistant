import { DateOffset } from "../../store/template";

export const dateOffsetToString = (
  offset: DateOffset,
  holidayOffset?: number
) => {
  let str = "semester start";
  if (offset.weeks) str += ` + ${offset.weeks} weeks`;
  if (offset.days) str += ` + ${offset.days} days`;
  if (holidayOffset) str += ` + ${holidayOffset} holidays`;
  return str;
};

export const formatDate = (unix: number) => {
  return new Date(unix).toLocaleString();
};
