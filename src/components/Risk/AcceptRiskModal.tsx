import { Box, Button, Typography } from "@mui/material";
import type { IModalProps } from "../Modal";
import { Modal } from "../Modal";
import { DoNotWarnCheckbox } from "./DoNotWarnCheckbox";
import type { ReactElement } from "react";

interface IProps extends IModalProps {
  onAccept: () => void;
}

const Content = ({ onAccept }: IProps): ReactElement => {
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
        <Button onClick={onAccept}>I understand</Button>
        <DoNotWarnCheckbox />
      </Box>
    </>
  );
};

export const AcceptRiskModal = (props: IProps): ReactElement => {
  return (
    <Modal {...props}>
      <Content {...props} />
    </Modal>
  );
};
