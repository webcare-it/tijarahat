import "./index.css";
import { AppProvider } from "./provider";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppRoutes } from "./pages";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  </StrictMode>
);
