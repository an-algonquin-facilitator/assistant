import type { DateOffset } from "../../store/template";

export const dateOffsetToString = (
  offset: DateOffset,
  holidayOffset?: number,
): string => {
  let str = "semester start";
  if (Number(offset.weeks) > 0) str += ` + ${offset.weeks} weeks`;
  if (Number(offset.days) > 0) str += ` + ${offset.days} days`;
  if (Number(holidayOffset) > 0) str += ` + ${holidayOffset} holidays`;
  return str;
};

export const formatDate = (unix: number): string => {
  return new Date(unix).toLocaleString();
};
