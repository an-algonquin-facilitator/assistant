import AnnouncementIcon from "@mui/icons-material/Announcement";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  Tooltip,
  Typography,
} from "@mui/material";
import type { INewsPlan } from "../../store/plan";
import { dateOffsetToString, formatDate } from "./utils";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface IProps {
  news: INewsPlan;
  expanded: string;
  setExpanded: (id: string) => void;
}

export const ReviewNews = ({ news, expanded, setExpanded }: IProps) => {
  const id = "N" + news.name;
  return (
    <Accordion expanded={expanded === id} onChange={() => setExpanded(id)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ display: "flex", alignItems: "center" }}>
          <AnnouncementIcon /> {news.name}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
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
        <Card elevation={24} sx={{ p: 2 }}>
          <Typography>
            <span dangerouslySetInnerHTML={{ __html: news.content }} />
          </Typography>
        </Card>
      </AccordionDetails>
    </Accordion>
  );
};
