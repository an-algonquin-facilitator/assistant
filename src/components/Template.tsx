import { Box, Button, IconButton, Typography } from "@mui/material";
import { IPageProps } from "./Page";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { ReviewTemplate } from "./Review";
import { useDispatch } from "react-redux";
import { setStartDateUnixMS, setTemplate } from "../store/template";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { CourseList } from "./CourseList";

export const Template = ({ next }: IPageProps) => {
  const [validJSON, setValidJSON] = useState(false);
  const [filename, setFilename] = useState("");
  const [date, setDate] = useState<Dayjs | null>(dayjs(new Date()));
  const dispatch = useDispatch();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (!f) {
      return;
    }
    f.text()
      .then((t) => {
        try {
          const data = JSON.parse(t);
          setValidJSON(true);
          dispatch(setTemplate(data));
          const a = data?.assignments?.length
            ? `(${data.assignments.length} assignments)`
            : "";
          const q = data?.quizzes?.length
            ? `(${data.quizzes.length} quizzes)`
            : "";
          setFilename(`${f.name} ${[a, q].join(" ")}`);
        } catch (err) {
          setValidJSON(false);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const onDateChange = (d: Dayjs | null) => {
    if (!d) return;

    setDate(d);
    dispatch(setStartDateUnixMS(d.toDate().getTime()));
  };
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
      <Typography variant="h3">Template</Typography>
      <DesktopDatePicker
        onChange={onDateChange}
        format="YYYY-MM-DD"
        value={date}
        sx={{ m: 2 }}
        label="Semester start date"
      />
      <Typography>Choose a template file:</Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton sx={{ m: 2 }} component="label">
          <FileUploadIcon />
          <input type="file" hidden onChange={onChange} />
        </IconButton>
        <Typography>{filename}</Typography>
      </Box>
      <Box
        sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}
      >
        <Button onClick={() => next(CourseList)}>BACK</Button>
        <Button
          onClick={() => next(ReviewTemplate)}
          disabled={!validJSON || !date}
        >
          REVIEW
        </Button>
      </Box>
    </Box>
  );
};
