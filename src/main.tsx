import { MantineProvider } from "@mantine/core";
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider withCssVariables>
      <App />
    </MantineProvider>
  </React.StrictMode>
);
