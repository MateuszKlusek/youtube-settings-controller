import { Box } from "@mantine/core";
import { type PropsWithChildren } from "react";

type Props = PropsWithChildren<object>;
export const EnvironmentContainer = ({ children }: Props) => {
  if (import.meta.env.DEV) {
    return (
      <Box className="flex justify-center items-center h-screen w-full ">
        <Box className="w-[300px] outline-2">{children}</Box>
      </Box>
    );
  } else {
    return <>{children}</>;
  }
};
