import { Button, CircularProgress, Tooltip } from "@mui/material";
import { SelectClassModal } from "./SelectClassModal";
import { useEnrollmentsQuery } from "../../api/api";
import { useState } from "react";

export const ClassSelectionButton = () => {
  const [open, setOpen] = useState(false);
  const { data: enrollments, loading, error } = useEnrollmentsQuery();

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <Tooltip title={error + "" || ""}>
          <Button disabled={loading || !!error} onClick={() => setOpen(true)}>
            Select class
          </Button>
        </Tooltip>
      )}
      <SelectClassModal
        myEnrollments={enrollments!}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};
