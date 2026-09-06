import ForumIcon from "@mui/icons-material/Forum";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Tooltip,
  Typography,
} from "@mui/material";
import type { DiscussionPlan } from "../../store/plan";
import { dateOffsetToString, formatDate } from "../Review/utils";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { ReactElement } from "react";
import { changeExpanded, useIsExpanded } from "../../store/review";
import { useAppDispatch } from "../../store/hooks";

interface ReviewDiscussionProps {
  discussion: DiscussionPlan;
}

export const ReviewDiscussion = ({
  discussion,
}: ReviewDiscussionProps): ReactElement => {
  const id = "D" + discussion.id;

  const isExpanded = useIsExpanded(id);
  const dispatch = useAppDispatch();
  return (
    <>
      <Accordion
        expanded={isExpanded}
        onChange={() => dispatch(changeExpanded(id))}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ display: "flex", alignItems: "center" }}>
            <ForumIcon /> {discussion.name} ({discussion.id})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Tooltip
            title={
              <Typography>
                {dateOffsetToString(discussion.startOffset)}
              </Typography>
            }
          >
            <Typography>Start: {formatDate(discussion.start)}</Typography>
          </Tooltip>
          <Tooltip
            title={
              <Typography>
                {dateOffsetToString(
                  discussion.dueOffset,
                  discussion.holidayOffset,
                )}
              </Typography>
            }
          >
            <Typography>Due: {formatDate(discussion.due)}</Typography>
          </Tooltip>
          <Tooltip
            title={
              <Typography>
                {dateOffsetToString(
                  discussion.endOffset,
                  discussion.holidayOffset,
                )}
              </Typography>
            }
          >
            <Typography>End: {formatDate(discussion.end)}</Typography>
          </Tooltip>
        </AccordionDetails>
      </Accordion>
    </>
  );
};
