import { FC } from "react";

export const examplesBaseUrl =
  "https://github.com/couzic/conflux-examples/blob/master/src/pages/examples/";

export const ExampleLink: FC<{ filename: string }> = ({ filename }) => (
  <a target="__blank" href={examplesBaseUrl + filename}>
    See source code
  </a>
);
