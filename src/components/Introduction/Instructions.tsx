import { Link, List, ListItem, Typography } from "@mui/material";
import { AcquireTokenCodeSnippet } from "./AcquireTokenCodeSnippet";
import type { ReactElement } from "react";

export const Instructions = (): ReactElement => {
  return (
    <>
      <Typography variant="h3">Let's setup your class</Typography>
      <Typography>
        First, we need your brightspace token. Here's how to do get it:
      </Typography>
      <List sx={{ listStyleType: "disc" }}>
        <ListItem sx={{ display: "list-item" }}>
          <Typography>
            naviguate to{" "}
            <Link
              href="https://brightspace.algonquincollege.com/"
              target="_blank"
              rel="noreferrer"
            >
              Brightspace
            </Link>
          </Typography>
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <Typography>hit F12 to open the debug tools</Typography>
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <Typography>
            naviguate to the <code>console</code> tab
          </Typography>
        </ListItem>
        <ListItem
          sx={{
            display: "list-item",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <Typography>
            copy+paste the following code into the <code>console</code>:
          </Typography>
          <AcquireTokenCodeSnippet />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <Typography>triple click it to select the result</Typography>
        </ListItem>

        <ListItem sx={{ display: "list-item" }}>
          <Typography>ctrl+c</Typography>
        </ListItem>
      </List>
      <Typography>
        This token is what lets this website act on your behalf.
      </Typography>
      <Typography>
        It is only saved on your computer, never shared with anyone and only
        expires after 1 hour.
      </Typography>
    </>
  );
};
