import { Box, IconButton, Typography } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import YAML from "yaml";
import { setTemplate } from "../../store/template";
import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";

const parseFile = (f: File, content: string): any | undefined => {
  try {
    if (f.name.endsWith(".json")) {
      return JSON.parse(content);
    } else {
      return YAML.parse(content);
    }
  } catch (err) {
    return undefined;
  }
};

export const UploadTemplateFile = () => {
  const dispatch = useAppDispatch();
  const [filename, setFilename] = useState("");

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const fileContent = await f.text();

    const data = parseFile(f, fileContent);
    if (data === undefined) return;
    dispatch(setTemplate(data));
    setFilename(f.name);
  };

  return (
    <>
      <Typography>Choose a template file:</Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton sx={{ m: 2 }} component="label">
          <FileUploadIcon />
          <input
            type="file"
            accept=".json,.yaml,.yml"
            hidden
            onChange={onChange}
          />
        </IconButton>
        <Typography>{filename}</Typography>
      </Box>
    </>
  );
};
