import { Box, IconButton, List, ListItem, Typography } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import YAML from "yaml";
import type { TemplateFile } from "./TemplateStep";
import { useState, type ReactElement } from "react";
import { TemplateFileValidator } from "./typeCheckTemplate";
import { unknownError } from "../../api/utils";
import { isLeft } from "fp-ts/lib/Either";
import { PathReporter } from "io-ts/lib/PathReporter";
import { Modal } from "../Modal";
import type { CourseTemplate } from "../../store/template";
import { setTemplateFile, useTemplateFileName } from "../../store/templateStep";
import { useAppDispatch } from "../../store/hooks";
import type { Enrollment } from "../../api/enrollment";

const parseFile = (
  f: File,
  content: string,
): [CourseTemplate, undefined] | [undefined, string[]] => {
  try {
    const parsed: unknown = f.name.endsWith(".json")
      ? JSON.parse(content)
      : YAML.parse(content);
    const decoded = TemplateFileValidator.decode(parsed);
    if (isLeft(decoded)) {
      return [undefined, PathReporter.report(decoded)];
    }
    return [decoded.right, undefined];
  } catch (err) {
    return [undefined, [unknownError(err).message]];
  }
};

interface UploadTemplateFileProps {
  recent: Enrollment[];
  onCourseSelected: (courseId: string) => void;
}

export const UploadTemplateFile = ({
  recent,
  onCourseSelected,
}: UploadTemplateFileProps): ReactElement => {
  const dispatch = useAppDispatch();
  const templateFileName = useTemplateFileName();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string[]>([]);

  const dispatchTemplateFile = (t?: TemplateFile): void => {
    dispatch(setTemplateFile(t));
    if (!t) return;

    const prefered = recent.find((c) =>
      c.OrgUnit.Code.includes(t.template.courseCode),
    );
    if (!prefered) return;
    onCourseSelected(String(prefered.OrgUnit.Id));
  };

  const onChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const f = e.target.files?.[0];
    if (!f) return;
    const fileContent = await f.text();

    const [template, err] = parseFile(f, fileContent);
    if (err) {
      setError(err);
      setTemplateFile(undefined);
      setOpen(true);
      return;
    }
    dispatchTemplateFile({
      filename: f.name,
      template,
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
      <Typography>{templateFileName ?? "None"}</Typography>
      <IconButton sx={{ m: 2 }} component="label">
        <FileUploadIcon />
        <input
          type="file"
          accept=".json,.yaml,.yml"
          hidden
          onChange={(e) => {
            void onChange(e);
          }}
        />
      </IconButton>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <Typography variant="h3">
            There is an error in your template:
          </Typography>
          <List>
            {error.map((e, i) => (
              <ListItem key={i}>
                <Typography>{e}</Typography>
              </ListItem>
            ))}
          </List>
        </>
      </Modal>
    </Box>
  );
};
