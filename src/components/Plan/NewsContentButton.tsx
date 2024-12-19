import { IconButton, Typography } from "@mui/material";
import { useState, type ReactElement } from "react";
import { Modal } from "../Modal";
import ArticleIcon from "@mui/icons-material/Article";
import type { NewsPlan } from "../../store/plan";

interface NewsContentButtonProps {
  news: NewsPlan;
}

export const NewsContentButton = ({
  news,
}: NewsContentButtonProps): ReactElement => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <ArticleIcon />
      </IconButton>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Typography>
          <span dangerouslySetInnerHTML={{ __html: news.content }} />
        </Typography>
      </Modal>
    </>
  );
};
