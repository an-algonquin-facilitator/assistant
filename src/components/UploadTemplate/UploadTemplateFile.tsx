import { Box, IconButton, Typography } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import YAML from "yaml";
import type { UnvalidatedTemplate } from "./UploadTemplateStep";
import type { ReactElement } from "react";

const parseFile = (
  f: File,
  content: string,
): UnvalidatedTemplate | undefined => {
  try {
    if (f.name.endsWith(".json")) {
      return JSON.parse(content);
    } else {
      return YAML.parse(content);
    }
  } catch {
    return undefined;
  }
};

interface UploadTemplateFileProps {
  ut?: UnvalidatedTemplate;
  setUT: (ut: UnvalidatedTemplate) => void;
}

export const UploadTemplateFile = ({
  ut,
  setUT,
}: UploadTemplateFileProps): ReactElement => {
  const onChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const fileContent = await f.text();

    const data = parseFile(f, fileContent);
    if (data === undefined) return;
    setUT({
      filename: f.name,
      assignments: data.assignments ?? [],
      quizzes: data.quizzes ?? [],
      news: data.news ?? [],
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography>Select Template:</Typography>
      <Typography>{ut?.filename ?? "None"}</Typography>
      <IconButton sx={{ m: 2 }} component="label">
        <FileUploadIcon />
        <input
          type="file"
          accept=".json,.yaml,.yml"
          hidden
          onChange={onChange}
        />
      </IconButton>
    </Box>
  );
};
