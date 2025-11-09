import { MantineProvider } from "@mantine/core";
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App";
import { EnvironmentContainer } from "./components/EnvironmentContainer";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider withCssVariables>
      <EnvironmentContainer>
        <App />
      </EnvironmentContainer>
    </MantineProvider>
  </React.StrictMode>
);
