import { Box, Button, Typography } from "@mui/material";
import { Modal } from "../Modal";
import { DoNotWarnCheckbox } from "./DoNotWarnCheckbox";
import { useState, type ReactElement } from "react";
import { ShouldWarn } from "../Risk/Risk";

interface IContentProps {
  onClose: () => void;
}

const Content = ({ onClose }: IContentProps): ReactElement => {
  return (
    <>
      <Typography variant="h5">
        This website is not officially supported by Algonquin College.
      </Typography>
      <br />
      <Typography variant="h5">
        While it is my intention to keep this up to date and bug free, it is
        unlikely to be perfect. I do want to keep improving it because I
        personally use it.
      </Typography>
      <br />
      <Typography variant="h5">
        By using this website you accept the risks that comes with it and you
        agree that you kept up to date with the documentation on how to use this
        website.
      </Typography>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          p: 4,
          flexDirection: "column",
        }}
      >
        <Button onClick={onClose}>I understand</Button>
        <DoNotWarnCheckbox />
      </Box>
    </>
  );
};

export const AcceptRiskModal = (): ReactElement => {
  const [open, setOpen] = useState(ShouldWarn());

  const onClose = (): void => setOpen(false);

  return (
    <Modal open={open} onClose={onClose}>
      <Content onClose={onClose} />
    </Modal>
  );
};
