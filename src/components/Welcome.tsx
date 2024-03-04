import {
  Box,
  Button,
  Input,
  Link,
  List,
  ListItem,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { ValidateTokenModal } from "./ValidateTokenModal";
import { useDispatch } from "react-redux";
import { setToken } from "../store/token";
import { IPageProps } from "./Page";
import { CourseList } from "./CourseList";
import SyntaxHighlighter from "react-syntax-highlighter";
import { monokai } from "react-syntax-highlighter/dist/esm/styles/hljs";

const code = `console.log(JSON.parse(localStorage["D2L.Fetch.Tokens"])["*:*:*"].access_token);`;

const MagicCode = () => {
  const [open, setOpen] = useState(false);

  const onClick = () => {
    navigator.clipboard.writeText(code);
    setOpen(true);
  };

  return (
    <Tooltip
      title={<Typography>Copied!</Typography>}
      open={open}
      onClose={() => setOpen(false)}
    >
      <Paper sx={{ m: 2, p: 0 }} elevation={5} onClick={onClick}>
        <SyntaxHighlighter
          language="javascript"
          style={monokai}
          customStyle={{
            padding: 32,
            borderRadius: 4,
            userSelect: "none",
            margin: 0,
          }}
        >
          {code}
        </SyntaxHighlighter>
      </Paper>
    </Tooltip>
  );
};

export const Welcome = ({ next }: IPageProps) => {
  const [field, setField] = useState(localStorage.getItem("token") ?? "");
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setField(e.target.value);
    dispatch(setToken(e.target.value));
  };

  const onValidated = () => {
    handleClose();
    next(CourseList);
    localStorage.setItem("token", field);
  };

  return (
    <>
      <Typography variant="h4">
        Welcome to the AC Online course assistant.
      </Typography>
      <br />
      <Typography sx={{ color: "red" }}>
        This website is not officially supported by AC Online.
      </Typography>
      <br />
      <Typography variant="h5">Getting started!</Typography>
      <Typography>First, we need your brightspace token.</Typography>
      <List>
        <ListItem>
          <Typography>
            In order to acquire your token please naviguate to{" "}
            <Link
              href="https://brightspace.algonquincollege.com/"
              target="_blank"
            >
              Brightspace
            </Link>
          </Typography>
        </ListItem>
        <ListItem>
          <Typography>hit F12 to open the debug tools</Typography>
        </ListItem>
        <ListItem>
          <Typography>
            naviguate to the <code>console</code> tab
          </Typography>
        </ListItem>
        <ListItem
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <Typography>run the following code:</Typography>
          <MagicCode />
        </ListItem>
      </List>
      <Typography>This will print your token in the console.</Typography>
      <Typography>
        This token is what lets this website access your courses and
        assignments.
      </Typography>
      <Typography>
        It is only saved on this website and only valid for at most 1 hour.
      </Typography>
      <br />
      <Input
        value={field}
        onChange={onChange}
        sx={{ width: "100%" }}
        placeholder="Copy paste the token here"
      ></Input>
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Button disabled={field === ""} onClick={handleOpen}>
          Validate
        </Button>
      </Box>
      <ValidateTokenModal
        open={open}
        onClose={handleClose}
        onValidated={onValidated}
      />
    </>
  );
};
