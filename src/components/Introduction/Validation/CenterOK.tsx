import { Box, Button } from "@mui/material";

interface CenterOKProps {
  onClick: () => void;
}

export const CenterOK = ({ onClick }: CenterOKProps) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Button onClick={onClick}>OK</Button>
    </Box>
  );
};
