import { Typography } from "@mui/material";

interface SpecificationProps {
  templateCount: number;
  classCount: number;
  resourceName: string;
}

export const Specification = ({
  templateCount,
  classCount,
  resourceName,
}: SpecificationProps) => {
  const color = templateCount === classCount ? "orange" : "green";
  return (
    <Typography>
      <Typography sx={{ color }} component="span">
        {templateCount}
      </Typography>{" "}
      {resourceName} out of{" "}
      <Typography sx={{ color }} component="span">
        {classCount}
      </Typography>{" "}
      in the class
    </Typography>
  );
};
