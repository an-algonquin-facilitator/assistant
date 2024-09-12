import { DesktopDatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useDispatch } from "react-redux";
import { setStartDateUnixMS, useStartDateUnixMS } from "../../store/template";

export const SemesterStartDate = () => {
  const startDateUnixMS = useStartDateUnixMS();
  const date = dayjs(new Date(startDateUnixMS));
  const dispatch = useDispatch();

  const onDateChange = (d: Dayjs | null) => {
    if (!d) return;
    dispatch(setStartDateUnixMS(d.toDate().getTime()));
  };

  return (
    <DesktopDatePicker
      onChange={onDateChange}
      format="YYYY-MM-DD"
      value={date}
      sx={{ m: 2 }}
      label="Semester start date"
    />
  );
};
