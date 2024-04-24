import AnnouncementIcon from "@mui/icons-material/Announcement";
import { Box, Tooltip, Typography } from "@mui/material";
import { DateOffset } from "../store/template";
import { INewsPlan } from "../store/plan";

const dateOffsetToString = (offset: DateOffset) => {
  let str = "semester start";
  if (offset.weeks) str += ` + ${offset.weeks} weeks`;
  if (offset.days) str += ` + ${offset.days} days`;
  return str;
};

const formatDate = (unix: number) => {
  return new Date(unix).toLocaleString();
};

interface IProps {
  news: INewsPlan;
}

export const ReviewNews = ({ news }: IProps) => {
  return (
    <>
      <Typography sx={{ display: "flex", alignItems: "center" }}>
        <AnnouncementIcon /> {news.name} ({news.id})
      </Typography>
      <Box sx={{ m: 2 }}>
        <Tooltip
          title={<Typography>{dateOffsetToString(news.openOffset)}</Typography>}
        >
          <Typography>Start: {formatDate(news.open)}</Typography>
        </Tooltip>
        <Tooltip
          title={
            <Typography>{dateOffsetToString(news.dismissOffset)}</Typography>
          }
        >
          <Typography>Due: {formatDate(news.dismiss)}</Typography>
        </Tooltip>
      </Box>
    </>
  );
};
