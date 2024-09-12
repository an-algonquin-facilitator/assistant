import { Box, Card } from "@mui/material";
import { Assistant } from "./components/Assistant/Assistant";

export function App() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
      }}
    >
      <Card sx={{ p: 4, width: "70vw" }}>
        <Assistant />
      </Card>
    </Box>
  );
}
