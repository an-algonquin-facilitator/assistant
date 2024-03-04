import { Box, Card } from "@mui/material";
import { Welcome } from "./components/Welcome";
import { useState } from "react";
import { IPageProps } from "./components/Page";

export function App() {
  const [Page, setPage] = useState({ Page: Welcome });

  const next = (f: (props: IPageProps) => JSX.Element) => {
    setPage({ Page: f });
  };
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
      }}
    >
      <Card sx={{ p: 4 }}>
        <Page.Page next={next} />
      </Card>
    </Box>
  );
}
