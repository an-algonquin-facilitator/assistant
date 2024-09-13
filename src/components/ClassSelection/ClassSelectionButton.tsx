import { Button, CircularProgress, Tooltip } from "@mui/material";
import { SelectClassModal } from "./SelectClassModal";
import { useEnrollmentsQuery } from "../../api/api";
import type { ReactElement } from "react";
import { useState } from "react";

export const ClassSelectionButton = (): ReactElement => {
  const [open, setOpen] = useState(false);
  const { data: enrollments, loading, error } = useEnrollmentsQuery();

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <Tooltip title={error + "" || ""}>
          <Button disabled={error != null} onClick={() => setOpen(true)}>
            Select class
          </Button>
        </Tooltip>
      )}
      <SelectClassModal
        enrollments={enrollments?.Items ?? []}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};
