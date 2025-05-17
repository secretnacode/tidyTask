import { FC } from "react";

export type TaskStatusCardType = {
  logo: FC<React.SVGProps<SVGSVGElement>>;
  status: string;
  name?: string;
  count?: number;
  style: string;
};
