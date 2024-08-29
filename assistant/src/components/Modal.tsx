import { Modal as MuiModal, Paper } from "@mui/material";

export interface IModalProps {
  open: boolean;
  onClose: () => void;
}

interface IProps extends IModalProps {
  children: React.ReactNode;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};
export const Modal = ({ children, open, onClose }: IProps) => {
  return (
    <MuiModal open={open} onClose={onClose}>
      <Paper elevation={5} sx={style}>
        {children}
      </Paper>
    </MuiModal>
  );
};
