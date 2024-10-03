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

const pad = (s: string, n: number): string => {
  while (s.length < n) {
    s = "0" + s;
  }
  return s;
};

export const formatDate = (unix: number): string => {
  const d = new Date(unix);
  const YYYY = d.getFullYear();
  const padLength = 2;
  const MM = pad(d.getMonth() + "", padLength);
  const DD = pad(d.getDate() + "", padLength);
  const hh = pad(d.getHours() + "", padLength);
  const mm = pad(d.getMinutes() + "", padLength);
  const ss = pad(d.getSeconds() + "", padLength);
  return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`;
};
